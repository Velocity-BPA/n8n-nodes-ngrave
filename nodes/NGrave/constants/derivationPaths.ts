/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Standard BIP derivation path templates for NGRAVE ZERO
 *
 * The NGRAVE ZERO supports various derivation path standards
 * for different cryptocurrencies and account structures.
 */

/**
 * Bitcoin derivation path templates
 */
export const BITCOIN_PATHS = {
  /** BIP44 Legacy (P2PKH) - addresses start with 1 */
  LEGACY: "m/44'/0'/0'",
  /** BIP49 SegWit (P2SH-P2WPKH) - addresses start with 3 */
  SEGWIT: "m/49'/0'/0'",
  /** BIP84 Native SegWit (P2WPKH) - addresses start with bc1q */
  NATIVE_SEGWIT: "m/84'/0'/0'",
  /** BIP86 Taproot (P2TR) - addresses start with bc1p */
  TAPROOT: "m/86'/0'/0'",
  /** Multi-signature wallet path */
  MULTISIG: "m/48'/0'/0'/2'",
} as const;

/**
 * Ethereum and EVM derivation path templates
 */
export const ETHEREUM_PATHS = {
  /** Standard BIP44 path for Ethereum */
  STANDARD: "m/44'/60'/0'/0",
  /** Ledger Live style path */
  LEDGER_LIVE: "m/44'/60'",
  /** Legacy path */
  LEGACY: "m/44'/60'/0'",
} as const;

/**
 * Solana derivation path templates
 */
export const SOLANA_PATHS = {
  /** Standard Solana path */
  STANDARD: "m/44'/501'/0'/0'",
  /** Phantom wallet style */
  PHANTOM: "m/44'/501'",
} as const;

/**
 * Other chain derivation paths
 */
export const OTHER_PATHS = {
  COSMOS: "m/44'/118'/0'/0/0",
  XRP: "m/44'/144'/0'/0/0",
  CARDANO: "m/1852'/1815'/0'",
  POLKADOT: "m/44'/354'/0'/0'/0'",
} as const;

/**
 * Path purpose values (BIP43)
 */
export const PATH_PURPOSES = {
  BIP44: 44,
  BIP49: 49,
  BIP84: 84,
  BIP86: 86,
  MULTISIG: 48,
  CARDANO: 1852,
} as const;

/**
 * SLIP44 coin types
 */
export const SLIP44_COIN_TYPES = {
  BITCOIN: 0,
  BITCOIN_TESTNET: 1,
  ETHEREUM: 60,
  SOLANA: 501,
  COSMOS: 118,
  XRP: 144,
  CARDANO: 1815,
  POLKADOT: 354,
} as const;

/**
 * Get the default derivation path for a chain
 */
export function getDefaultPath(chainId: string, addressType?: string): string {
  switch (chainId) {
    case 'bitcoin':
      switch (addressType) {
        case 'legacy':
          return BITCOIN_PATHS.LEGACY;
        case 'segwit':
          return BITCOIN_PATHS.SEGWIT;
        case 'taproot':
          return BITCOIN_PATHS.TAPROOT;
        default:
          return BITCOIN_PATHS.NATIVE_SEGWIT;
      }
    case 'ethereum':
    case 'bnb':
    case 'polygon':
    case 'avalanche':
    case 'arbitrum':
    case 'optimism':
    case 'fantom':
    case 'cronos':
    case 'gnosis':
    case 'base':
      return ETHEREUM_PATHS.STANDARD;
    case 'solana':
      return SOLANA_PATHS.STANDARD;
    case 'cosmos':
      return OTHER_PATHS.COSMOS;
    case 'xrp':
      return OTHER_PATHS.XRP;
    case 'cardano':
      return OTHER_PATHS.CARDANO;
    case 'polkadot':
      return OTHER_PATHS.POLKADOT;
    default:
      return ETHEREUM_PATHS.STANDARD;
  }
}

/**
 * Parse a derivation path into components
 */
export function parsePath(path: string): {
  purpose: number;
  coinType: number;
  account: number;
  change?: number;
  index?: number;
} {
  const parts = path.replace(/'/g, '').split('/').filter(Boolean);

  return {
    purpose: parseInt(parts[1], 10),
    coinType: parseInt(parts[2], 10),
    account: parseInt(parts[3], 10),
    change: parts[4] ? parseInt(parts[4], 10) : undefined,
    index: parts[5] ? parseInt(parts[5], 10) : undefined,
  };
}

/**
 * Build a derivation path from components
 */
export function buildPath(
  purpose: number,
  coinType: number,
  account: number,
  change?: number,
  index?: number,
  hardened: { purpose?: boolean; coinType?: boolean; account?: boolean } = {
    purpose: true,
    coinType: true,
    account: true,
  },
): string {
  let path = 'm';
  path += `/${purpose}${hardened.purpose ? "'" : ''}`;
  path += `/${coinType}${hardened.coinType ? "'" : ''}`;
  path += `/${account}${hardened.account ? "'" : ''}`;

  if (change !== undefined) {
    path += `/${change}`;
    if (index !== undefined) {
      path += `/${index}`;
    }
  }

  return path;
}

/**
 * Derivation path options for n8n UI
 */
export const DERIVATION_PATH_OPTIONS = [
  { name: 'BIP84 Native SegWit (bc1q...)', value: BITCOIN_PATHS.NATIVE_SEGWIT },
  { name: 'BIP86 Taproot (bc1p...)', value: BITCOIN_PATHS.TAPROOT },
  { name: 'BIP49 SegWit (3...)', value: BITCOIN_PATHS.SEGWIT },
  { name: 'BIP44 Legacy (1...)', value: BITCOIN_PATHS.LEGACY },
  { name: 'BIP48 Multi-Signature', value: BITCOIN_PATHS.MULTISIG },
  { name: 'Custom Path', value: 'custom' },
] as const;
