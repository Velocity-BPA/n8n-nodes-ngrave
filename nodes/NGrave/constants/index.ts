/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export * from './chains';
export * from './derivationPaths';
export * from './urTypes';
export * from './securityLevels';
export * from './events';

// Re-export with commonly used aliases
import { BITCOIN_PATHS, ETHEREUM_PATHS, SOLANA_PATHS, OTHER_PATHS, getDefaultPath } from './derivationPaths';
import { EAL_LEVELS, PIN_SETTINGS, BIOMETRIC_SETTINGS, getSecurityLevelDescription as getSecLevelDesc } from './securityLevels';
import { NGRAVE_EVENT_TYPES } from './events';
import { SUPPORTED_CHAINS as CHAINS_LIST } from './chains';

// BIP44_PATHS alias for backward compatibility
export const BIP44_PATHS = {
  BITCOIN: {
    LEGACY: BITCOIN_PATHS.LEGACY,
    SEGWIT: BITCOIN_PATHS.SEGWIT,
    NATIVE_SEGWIT: BITCOIN_PATHS.NATIVE_SEGWIT,
    TAPROOT: BITCOIN_PATHS.TAPROOT,
  },
  ETHEREUM: ETHEREUM_PATHS.STANDARD,
  SOLANA: SOLANA_PATHS.STANDARD,
  COSMOS: OTHER_PATHS.COSMOS,
  XRP: OTHER_PATHS.XRP,
  CARDANO: OTHER_PATHS.CARDANO,
  POLKADOT: OTHER_PATHS.POLKADOT,
} as const;

// SECURITY_LEVELS alias
export const SECURITY_LEVELS = {
  EAL7: {
    name: 'EAL7',
    level: 7,
    description: EAL_LEVELS.EAL7.description + ' - the highest security certification',
    features: ['secure_element', 'tamper_resistant', 'air_gapped', 'biometric'],
  },
} as const;

// NGRAVE_ZERO_FEATURES constant
export const NGRAVE_ZERO_FEATURES = {
  SCREEN_SIZE: '4.0 inch',
  BATTERY_CAPACITY: '1200mAh',
  EAL_LEVEL: 7,
  SECURE_ELEMENT: true,
  AIR_GAPPED: true,
  BIOMETRIC: true,
  MAX_PIN_ATTEMPTS: PIN_SETTINGS.MAX_ATTEMPTS,
  MAX_FINGERPRINTS: BIOMETRIC_SETTINGS.MAX_FINGERPRINTS,
  PIN_MIN_LENGTH: PIN_SETTINGS.MIN_LENGTH,
  PIN_MAX_LENGTH: PIN_SETTINGS.MAX_LENGTH,
} as const;

// NGRAVE_EVENTS alias
export const NGRAVE_EVENTS = NGRAVE_EVENT_TYPES;

// Helper function aliases
export const getDerivationPath = getDefaultPath;
export const getSecurityLevelDescription = getSecLevelDesc;

// Chain helper - get chain by id
export function getChainById(chainId: string) {
  const chains = Object.values(CHAINS_LIST);
  return chains.find((c: any) => c.id === chainId);
}

/**
 * NGRAVE ZERO Version Information
 */
export const NGRAVE_VERSION = {
  NODE_VERSION: '1.0.0',
  MIN_FIRMWARE_VERSION: '1.0.0',
  SUPPORTED_UR_VERSION: '2.0',
} as const;

/**
 * Wallet export format options
 */
export const EXPORT_FORMATS = {
  LIQUID: 'liquid',
  SPARROW: 'sparrow',
  BLUE_WALLET: 'bluewallet',
  ELECTRUM: 'electrum',
  BITCOIN_CORE: 'bitcoin-core',
  GENERIC_JSON: 'json',
  OUTPUT_DESCRIPTOR: 'descriptor',
} as const;

/**
 * Export format options for n8n UI
 */
export const EXPORT_FORMAT_OPTIONS = [
  { name: 'NGRAVE LIQUID', value: EXPORT_FORMATS.LIQUID },
  { name: 'Sparrow Wallet', value: EXPORT_FORMATS.SPARROW },
  { name: 'BlueWallet', value: EXPORT_FORMATS.BLUE_WALLET },
  { name: 'Electrum', value: EXPORT_FORMATS.ELECTRUM },
  { name: 'Bitcoin Core', value: EXPORT_FORMATS.BITCOIN_CORE },
  { name: 'Generic JSON', value: EXPORT_FORMATS.GENERIC_JSON },
  { name: 'Output Descriptor', value: EXPORT_FORMATS.OUTPUT_DESCRIPTOR },
] as const;

/**
 * PSBT versions
 */
export const PSBT_VERSIONS = {
  V0: 0,
  V2: 2,
} as const;

/**
 * Address types for Bitcoin
 */
export const ADDRESS_TYPES = {
  LEGACY: 'legacy',
  SEGWIT: 'segwit',
  NATIVE_SEGWIT: 'native-segwit',
  TAPROOT: 'taproot',
} as const;

/**
 * Address type options for n8n UI
 */
export const ADDRESS_TYPE_OPTIONS = [
  { name: 'Native SegWit (bc1q...)', value: ADDRESS_TYPES.NATIVE_SEGWIT },
  { name: 'Taproot (bc1p...)', value: ADDRESS_TYPES.TAPROOT },
  { name: 'SegWit (3...)', value: ADDRESS_TYPES.SEGWIT },
  { name: 'Legacy (1...)', value: ADDRESS_TYPES.LEGACY },
] as const;

/**
 * Error codes
 */
export const ERROR_CODES = {
  // QR errors
  QR_PARSE_FAILED: 'QR_PARSE_FAILED',
  QR_INVALID_FORMAT: 'QR_INVALID_FORMAT',
  QR_ANIMATION_INCOMPLETE: 'QR_ANIMATION_INCOMPLETE',
  QR_UR_DECODE_FAILED: 'QR_UR_DECODE_FAILED',

  // Signing errors
  SIGNING_REJECTED: 'SIGNING_REJECTED',
  SIGNING_TIMEOUT: 'SIGNING_TIMEOUT',
  INVALID_SIGNATURE: 'INVALID_SIGNATURE',

  // Transaction errors
  TX_BUILD_FAILED: 'TX_BUILD_FAILED',
  TX_BROADCAST_FAILED: 'TX_BROADCAST_FAILED',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',

  // Device errors
  DEVICE_NOT_CONNECTED: 'DEVICE_NOT_CONNECTED',
  DEVICE_LOCKED: 'DEVICE_LOCKED',
  BIOMETRIC_FAILED: 'BIOMETRIC_FAILED',
  PIN_INCORRECT: 'PIN_INCORRECT',

  // Security errors
  TAMPER_DETECTED: 'TAMPER_DETECTED',
  SECURITY_VIOLATION: 'SECURITY_VIOLATION',

  // LIQUID errors
  LIQUID_CONNECTION_FAILED: 'LIQUID_CONNECTION_FAILED',
  LIQUID_SYNC_FAILED: 'LIQUID_SYNC_FAILED',

  // General errors
  INVALID_INPUT: 'INVALID_INPUT',
  OPERATION_FAILED: 'OPERATION_FAILED',
  UNSUPPORTED_CHAIN: 'UNSUPPORTED_CHAIN',
} as const;

/**
 * Logging notice for BSL compliance
 */
export const LICENSING_NOTICE = `[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`;

/**
 * Log licensing notice (once per load)
 */
let licensingNoticeLogged = false;

export function logLicensingNotice(): void {
  if (!licensingNoticeLogged) {
    console.warn(LICENSING_NOTICE);
    licensingNoticeLogged = true;
  }
}
