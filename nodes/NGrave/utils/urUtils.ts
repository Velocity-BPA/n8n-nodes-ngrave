// @ts-nocheck
/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import * as cbor from 'cbor';
import { UR_TYPES, CBOR_TAGS, isUrTypeSupported } from '../constants';

/**
 * Uniform Resource (UR) Utilities for NGRAVE ZERO
 *
 * UR is a standard for encoding binary data in QR codes developed by
 * Blockchain Commons. It's used for air-gapped communication between
 * hardware wallets and software wallets.
 */

export interface URData {
  type: string;
  payload: Buffer;
}

export interface DecodedUR {
  type: string;
  data: unknown;
  raw: Buffer;
}

export interface HDKeyData {
  isMaster: boolean;
  isPrivate: boolean;
  keyData: Buffer;
  chainCode?: Buffer;
  useInfo?: {
    type: number;
    network: number;
  };
  origin?: {
    sourceFingerprint?: number;
    depth?: number;
    components: Array<{
      index: number;
      hardened: boolean;
    }>;
  };
  parentFingerprint?: number;
  name?: string;
}

export interface CryptoAccountData {
  masterFingerprint: number;
  outputDescriptors: Array<{
    scriptType: string;
    keyData: HDKeyData;
  }>;
}

/**
 * Bytewords encoding for UR
 * Minimal implementation - uses base32 style encoding
 */
const BYTEWORDS = 'aeioubcdfghjklmnpqrstvwxyz';

function encodeBytewords(data: Buffer): string {
  // Simplified bytewords encoding
  let result = '';
  for (const byte of data) {
    const high = Math.floor(byte / 26);
    const low = byte % 26;
    result += BYTEWORDS[high % 26];
    result += BYTEWORDS[low];
  }
  return result;
}

function decodeBytewords(encoded: string): Buffer {
  const bytes: number[] = [];
  for (let i = 0; i < encoded.length; i += 2) {
    const high = BYTEWORDS.indexOf(encoded[i].toLowerCase());
    const low = BYTEWORDS.indexOf(encoded[i + 1]?.toLowerCase() || 'a');
    if (high === -1 || low === -1) {
      throw new Error('Invalid bytewords encoding');
    }
    bytes.push((high * 26 + low) % 256);
  }
  return Buffer.from(bytes);
}

/**
 * Encode data as UR string
 */
export function encodeUR(type: string, data: Buffer): string {
  const encoded = encodeBytewords(data);
  return `ur:${type}/${encoded}`;
}

/**
 * Decode UR string to data
 */
export function decodeUR(urString: string): URData {
  const match = urString.toLowerCase().match(/^ur:([a-z0-9-]+)\/(.+)$/);
  if (!match) {
    throw new Error('Invalid UR format');
  }

  const type = match[1];
  const payload = decodeBytewords(match[2]);

  return { type, payload };
}

/**
 * Encode CBOR with UR type
 */
export async function encodeCBORWithTag(
  urType: string,
  data: unknown,
): Promise<Buffer> {
  const tag = getCborTagForUrType(urType);

  if (tag) {
    return cbor.encode(new cbor.Tagged(tag, data));
  }

  return cbor.encode(data);
}

function getCborTagForUrType(urType: string): number | undefined {
  const tagMap: Record<string, number> = {
    [UR_TYPES.CRYPTO_SEED]: CBOR_TAGS.CRYPTO_SEED,
    [UR_TYPES.CRYPTO_HDKEY]: CBOR_TAGS.CRYPTO_HDKEY,
    [UR_TYPES.CRYPTO_KEYPATH]: CBOR_TAGS.CRYPTO_KEYPATH,
    [UR_TYPES.CRYPTO_COIN_INFO]: CBOR_TAGS.CRYPTO_COIN_INFO,
    [UR_TYPES.CRYPTO_ECKEY]: CBOR_TAGS.CRYPTO_ECKEY,
    [UR_TYPES.CRYPTO_ADDRESS]: CBOR_TAGS.CRYPTO_ADDRESS,
    [UR_TYPES.CRYPTO_OUTPUT]: CBOR_TAGS.CRYPTO_OUTPUT,
    [UR_TYPES.CRYPTO_PSBT]: CBOR_TAGS.CRYPTO_PSBT,
    [UR_TYPES.CRYPTO_ACCOUNT]: CBOR_TAGS.CRYPTO_ACCOUNT,
    [UR_TYPES.ETH_SIGN_REQUEST]: CBOR_TAGS.ETH_SIGN_REQUEST,
    [UR_TYPES.ETH_SIGNATURE]: CBOR_TAGS.ETH_SIGNATURE,
    [UR_TYPES.SOL_SIGN_REQUEST]: CBOR_TAGS.SOL_SIGN_REQUEST,
    [UR_TYPES.SOL_SIGNATURE]: CBOR_TAGS.SOL_SIGNATURE,
  };
  return tagMap[urType];
}

/**
 * Decode CBOR data
 */
export async function decodeCBOR(data: Buffer): Promise<unknown> {
  return cbor.decode(data);
}

/**
 * Create a crypto-psbt UR for a PSBT
 */
export function encodePSBT(psbtBase64: string): string {
  const psbtBuffer = Buffer.from(psbtBase64, 'base64');
  return encodeUR(UR_TYPES.CRYPTO_PSBT, psbtBuffer);
}

/**
 * Decode a crypto-psbt UR to base64 PSBT
 */
export function decodePSBT(urString: string): string {
  const { type, payload } = decodeUR(urString);

  if (type !== UR_TYPES.CRYPTO_PSBT) {
    throw new Error(`Expected ${UR_TYPES.CRYPTO_PSBT}, got ${type}`);
  }

  return payload.toString('base64');
}

/**
 * Create an eth-sign-request UR
 */
export async function encodeEthSignRequest(
  requestId: Buffer,
  signData: Buffer,
  dataType: number,
  chainId: number,
  derivationPath: string,
  address?: string,
): Promise<string> {
  const requestData = new Map([
    [1, requestId],
    [2, signData],
    [3, dataType],
    [4, chainId],
    [5, parseDerivationPath(derivationPath)],
  ]);

  if (address) {
    requestData.set(6, Buffer.from(address.replace('0x', ''), 'hex'));
  }

  const encoded = await encodeCBORWithTag(UR_TYPES.ETH_SIGN_REQUEST, requestData);
  return encodeUR(UR_TYPES.ETH_SIGN_REQUEST, encoded);
}

/**
 * Decode an eth-signature UR
 */
export async function decodeEthSignature(
  urString: string,
): Promise<{
  requestId: Buffer;
  signature: Buffer;
}> {
  const { type, payload } = decodeUR(urString);

  if (type !== UR_TYPES.ETH_SIGNATURE) {
    throw new Error(`Expected ${UR_TYPES.ETH_SIGNATURE}, got ${type}`);
  }

  const decoded = (await decodeCBOR(payload)) as Map<number, Buffer>;

  return {
    requestId: decoded.get(1)!,
    signature: decoded.get(2)!,
  };
}

/**
 * Parse derivation path to CBOR keypath format
 */
function parseDerivationPath(path: string): Map<number, unknown> {
  const components: Array<{ index: number; hardened: boolean }> = [];
  const parts = path.replace('m/', '').split('/');

  for (const part of parts) {
    const hardened = part.endsWith("'") || part.endsWith('h');
    const index = parseInt(part.replace(/['h]$/, ''), 10);
    components.push({ index, hardened });
  }

  return new Map([
    [1, components.map((c) => (c.hardened ? c.index | 0x80000000 : c.index))],
  ]);
}

/**
 * Create a crypto-hdkey UR for extended public key
 */
export async function encodeHDKey(keyData: HDKeyData): Promise<string> {
  const hdkeyMap = new Map<number, unknown>();

  hdkeyMap.set(1, keyData.isMaster);
  hdkeyMap.set(2, keyData.isPrivate);
  hdkeyMap.set(3, keyData.keyData);

  if (keyData.chainCode) {
    hdkeyMap.set(4, keyData.chainCode);
  }

  if (keyData.useInfo) {
    hdkeyMap.set(
      5,
      new Map([
        [1, keyData.useInfo.type],
        [2, keyData.useInfo.network],
      ]),
    );
  }

  if (keyData.origin) {
    const originMap = new Map<number, unknown>();
    if (keyData.origin.sourceFingerprint) {
      originMap.set(1, keyData.origin.sourceFingerprint);
    }
    if (keyData.origin.depth !== undefined) {
      originMap.set(2, keyData.origin.depth);
    }
    originMap.set(
      3,
      keyData.origin.components.map((c) =>
        c.hardened ? c.index | 0x80000000 : c.index,
      ),
    );
    hdkeyMap.set(6, originMap);
  }

  if (keyData.parentFingerprint) {
    hdkeyMap.set(8, keyData.parentFingerprint);
  }

  if (keyData.name) {
    hdkeyMap.set(9, keyData.name);
  }

  const encoded = await encodeCBORWithTag(UR_TYPES.CRYPTO_HDKEY, hdkeyMap);
  return encodeUR(UR_TYPES.CRYPTO_HDKEY, encoded);
}

/**
 * Decode a crypto-hdkey UR
 */
export async function decodeHDKey(urString: string): Promise<HDKeyData> {
  const { type, payload } = decodeUR(urString);

  if (type !== UR_TYPES.CRYPTO_HDKEY) {
    throw new Error(`Expected ${UR_TYPES.CRYPTO_HDKEY}, got ${type}`);
  }

  const decoded = (await decodeCBOR(payload)) as Map<number, unknown>;

  const hdKey: HDKeyData = {
    isMaster: decoded.get(1) as boolean,
    isPrivate: decoded.get(2) as boolean,
    keyData: decoded.get(3) as Buffer,
  };

  if (decoded.has(4)) {
    hdKey.chainCode = decoded.get(4) as Buffer;
  }

  if (decoded.has(5)) {
    const useInfo = decoded.get(5) as Map<number, number>;
    hdKey.useInfo = {
      type: useInfo.get(1)!,
      network: useInfo.get(2)!,
    };
  }

  if (decoded.has(8)) {
    hdKey.parentFingerprint = decoded.get(8) as number;
  }

  if (decoded.has(9)) {
    hdKey.name = decoded.get(9) as string;
  }

  return hdKey;
}

/**
 * Validate UR string format
 */
export function validateUR(urString: string): {
  isValid: boolean;
  type?: string;
  error?: string;
} {
  if (!urString.toLowerCase().startsWith('ur:')) {
    return {
      isValid: false,
      error: 'UR string must start with "ur:"',
    };
  }

  const match = urString.toLowerCase().match(/^ur:([a-z0-9-]+)\/(.+)$/);
  if (!match) {
    return {
      isValid: false,
      error: 'Invalid UR format',
    };
  }

  const type = match[1];
  if (!isUrTypeSupported(type)) {
    return {
      isValid: false,
      type,
      error: `Unsupported UR type: ${type}`,
    };
  }

  return {
    isValid: true,
    type,
  };
}

/**
 * Get UR type from UR string
 */
export function getURType(urString: string): string | null {
  const match = urString.toLowerCase().match(/^ur:([a-z0-9-]+)\//);
  return match ? match[1] : null;
}
