// @ts-nocheck
/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  encodeUR,
  decodeUR,
  encodePSBT,
  decodePSBT,
  encodeEthSignRequest,
  decodeEthSignature,
  encodeHDKey,
  decodeHDKey,
  validateUR,
  getURType,
  type URData,
  type HDKeyData,
} from '../utils/urUtils';
import { UR_TYPES, ETH_DATA_TYPES } from '../constants';

/**
 * UR Codec for NGRAVE ZERO
 *
 * Handles encoding and decoding of Uniform Resource (UR) data
 * for air-gapped communication with the NGRAVE ZERO.
 */

export interface URCodecResult<T = unknown> {
  success: boolean;
  type?: string;
  data?: T;
  urString?: string;
  error?: string;
}

export interface PSBTCodecResult {
  success: boolean;
  psbtBase64?: string;
  urString?: string;
  error?: string;
}

export interface EthSignRequestData {
  requestId: string;
  signData: string;
  dataType: 'transaction' | 'typedData' | 'message' | 'personalMessage';
  chainId: number;
  derivationPath: string;
  address?: string;
}

export interface EthSignatureData {
  requestId: string;
  signature: string;
  r: string;
  s: string;
  v: number;
}

/**
 * Encode data as UR string
 */
export function encode(type: string, data: Buffer): URCodecResult<string> {
  try {
    const urString = encodeUR(type, data);
    return {
      success: true,
      type,
      urString,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Encoding failed',
    };
  }
}

/**
 * Decode UR string to data
 */
export function decode(urString: string): URCodecResult<Buffer> {
  try {
    const validation = validateUR(urString);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    const { type, payload } = decodeUR(urString);
    return {
      success: true,
      type,
      data: payload,
      urString,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Decoding failed',
    };
  }
}

/**
 * Encode PSBT as UR
 */
export function encodePSBTAsUR(psbtBase64: string): PSBTCodecResult {
  try {
    const urString = encodePSBT(psbtBase64);
    return {
      success: true,
      psbtBase64,
      urString,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'PSBT encoding failed',
    };
  }
}

/**
 * Decode PSBT from UR
 */
export function decodePSBTFromUR(urString: string): PSBTCodecResult {
  try {
    const psbtBase64 = decodePSBT(urString);
    return {
      success: true,
      psbtBase64,
      urString,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'PSBT decoding failed',
    };
  }
}

/**
 * Create Ethereum sign request UR
 */
export async function createEthSignRequest(
  data: EthSignRequestData,
): Promise<URCodecResult<string>> {
  try {
    const requestId = Buffer.from(data.requestId.replace(/-/g, ''), 'hex');
    const signData = Buffer.from(data.signData.replace('0x', ''), 'hex');

    let dataType: number;
    switch (data.dataType) {
      case 'transaction':
        dataType = ETH_DATA_TYPES.TRANSACTION;
        break;
      case 'typedData':
        dataType = ETH_DATA_TYPES.TYPED_DATA;
        break;
      case 'personalMessage':
        dataType = ETH_DATA_TYPES.PERSONAL_MESSAGE;
        break;
      default:
        dataType = ETH_DATA_TYPES.RAW_BYTES;
    }

    const urString = await encodeEthSignRequest(
      requestId,
      signData,
      dataType,
      data.chainId,
      data.derivationPath,
      data.address,
    );

    return {
      success: true,
      type: UR_TYPES.ETH_SIGN_REQUEST,
      urString,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create sign request',
    };
  }
}

/**
 * Parse Ethereum signature from UR
 */
export async function parseEthSignature(
  urString: string,
): Promise<URCodecResult<EthSignatureData>> {
  try {
    const { requestId, signature } = await decodeEthSignature(urString);

    // Parse signature components
    const r = signature.slice(0, 32).toString('hex');
    const s = signature.slice(32, 64).toString('hex');
    const v = signature[64];

    return {
      success: true,
      type: UR_TYPES.ETH_SIGNATURE,
      data: {
        requestId: requestId.toString('hex'),
        signature: '0x' + signature.toString('hex'),
        r: '0x' + r,
        s: '0x' + s,
        v,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse signature',
    };
  }
}

/**
 * Create HD Key UR for extended public key export
 */
export async function createHDKeyUR(
  keyData: HDKeyData,
): Promise<URCodecResult<string>> {
  try {
    const urString = await encodeHDKey(keyData);
    return {
      success: true,
      type: UR_TYPES.CRYPTO_HDKEY,
      urString,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create HD key UR',
    };
  }
}

/**
 * Parse HD Key from UR
 */
export async function parseHDKeyUR(
  urString: string,
): Promise<URCodecResult<HDKeyData>> {
  try {
    const hdKey = await decodeHDKey(urString);
    return {
      success: true,
      type: UR_TYPES.CRYPTO_HDKEY,
      data: hdKey,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse HD key',
    };
  }
}

/**
 * Get UR type from string
 */
export function getType(urString: string): string | null {
  return getURType(urString);
}

/**
 * Validate UR string
 */
export function validate(urString: string): {
  isValid: boolean;
  type?: string;
  error?: string;
} {
  return validateUR(urString);
}

/**
 * Check if data needs animated QR encoding
 */
export function needsAnimatedEncoding(
  data: Buffer,
  maxSingleQRSize: number = 200,
): boolean {
  return data.length > maxSingleQRSize;
}

/**
 * Detect UR type from data pattern
 */
export function detectURType(data: Buffer): string {
  // Simple heuristics for common types
  const dataHex = data.toString('hex');

  // PSBT magic bytes
  if (dataHex.startsWith('70736274')) {
    return UR_TYPES.CRYPTO_PSBT;
  }

  // Default to bytes
  return UR_TYPES.BYTES;
}
