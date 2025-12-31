/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Uniform Resource (UR) Type Registry for NGRAVE ZERO
 *
 * UR is the standard for encoding data in QR codes for
 * air-gapped communication between hardware wallets and software.
 * Reference: https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-005-ur.md
 */

/**
 * Core UR types from Blockchain Commons Registry
 */
export const UR_TYPES = {
  // Bytes and text
  BYTES: 'bytes',
  TEXT: 'text',

  // Cryptographic primitives
  CRYPTO_SEED: 'crypto-seed',
  CRYPTO_HDKEY: 'crypto-hdkey',
  CRYPTO_KEYPATH: 'crypto-keypath',
  CRYPTO_COIN_INFO: 'crypto-coininfo',
  CRYPTO_ECKEY: 'crypto-eckey',
  CRYPTO_ADDRESS: 'crypto-address',
  CRYPTO_OUTPUT: 'crypto-output',
  CRYPTO_ACCOUNT: 'crypto-account',

  // Bitcoin-specific
  CRYPTO_PSBT: 'crypto-psbt',

  // Multi-signature
  CRYPTO_MULTI_ACCOUNTS: 'crypto-multi-accounts',

  // Ethereum-specific
  ETH_SIGN_REQUEST: 'eth-sign-request',
  ETH_SIGNATURE: 'eth-signature',

  // Solana-specific
  SOL_SIGN_REQUEST: 'sol-sign-request',
  SOL_SIGNATURE: 'sol-signature',

  // Cosmos-specific
  COSMOS_SIGN_REQUEST: 'cosmos-sign-request',
  COSMOS_SIGNATURE: 'cosmos-signature',
} as const;

/**
 * CBOR tags used in UR encoding
 */
export const CBOR_TAGS = {
  UUID: 37,
  DATE: 1004,
  CRYPTO_SEED: 300,
  CRYPTO_HDKEY: 303,
  CRYPTO_KEYPATH: 304,
  CRYPTO_COIN_INFO: 305,
  CRYPTO_ECKEY: 306,
  CRYPTO_ADDRESS: 307,
  CRYPTO_OUTPUT: 308,
  CRYPTO_PSBT: 310,
  CRYPTO_ACCOUNT: 311,
  ETH_SIGN_REQUEST: 401,
  ETH_SIGNATURE: 402,
  SOL_SIGN_REQUEST: 501,
  SOL_SIGNATURE: 502,
} as const;

/**
 * UR encoding settings
 */
export const UR_SETTINGS = {
  /** Maximum bytes per QR fragment for animated sequences */
  DEFAULT_FRAGMENT_SIZE: 200,
  /** Minimum fragment size */
  MIN_FRAGMENT_SIZE: 50,
  /** Maximum fragment size */
  MAX_FRAGMENT_SIZE: 500,
  /** Default frames per second for animated QR */
  DEFAULT_FPS: 10,
  /** Fountain code redundancy factor */
  REDUNDANCY_FACTOR: 1.5,
} as const;

/**
 * QR code error correction levels
 */
export const QR_ERROR_CORRECTION = {
  LOW: 'L',
  MEDIUM: 'M',
  QUARTILE: 'Q',
  HIGH: 'H',
} as const;

/**
 * Ethereum data types for signing requests
 */
export const ETH_DATA_TYPES = {
  TRANSACTION: 1,
  TYPED_DATA: 2,
  RAW_BYTES: 3,
  TYPED_TRANSACTION: 4,
  PERSONAL_MESSAGE: 5,
} as const;

/**
 * Signing request origins
 */
export const REQUEST_ORIGINS = {
  UNKNOWN: 0,
  QR_CODE: 1,
  LIQUID_APP: 2,
  FILE_IMPORT: 3,
} as const;

/**
 * UR type to description mapping
 */
export const UR_TYPE_DESCRIPTIONS: Record<string, string> = {
  [UR_TYPES.CRYPTO_SEED]: 'Cryptographic seed data',
  [UR_TYPES.CRYPTO_HDKEY]: 'HD key (extended public or private key)',
  [UR_TYPES.CRYPTO_KEYPATH]: 'Key derivation path',
  [UR_TYPES.CRYPTO_COIN_INFO]: 'Cryptocurrency coin type information',
  [UR_TYPES.CRYPTO_ECKEY]: 'Elliptic curve key',
  [UR_TYPES.CRYPTO_ADDRESS]: 'Cryptocurrency address',
  [UR_TYPES.CRYPTO_OUTPUT]: 'Output descriptor',
  [UR_TYPES.CRYPTO_ACCOUNT]: 'Account descriptor',
  [UR_TYPES.CRYPTO_PSBT]: 'Partially Signed Bitcoin Transaction',
  [UR_TYPES.ETH_SIGN_REQUEST]: 'Ethereum signing request',
  [UR_TYPES.ETH_SIGNATURE]: 'Ethereum signature',
  [UR_TYPES.SOL_SIGN_REQUEST]: 'Solana signing request',
  [UR_TYPES.SOL_SIGNATURE]: 'Solana signature',
};

/**
 * Check if a UR type is supported
 */
export function isUrTypeSupported(urType: string): boolean {
  return Object.values(UR_TYPES).includes(urType as (typeof UR_TYPES)[keyof typeof UR_TYPES]);
}

/**
 * Get the CBOR tag for a UR type
 */
export function getCborTagForUrType(urType: string): number | undefined {
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
