/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Supported blockchain networks for NGRAVE ZERO
 */
export const SUPPORTED_CHAINS = {
  BITCOIN: {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    decimals: 8,
    slip44: 0,
    addressTypes: ['legacy', 'segwit', 'native-segwit', 'taproot'],
    networks: {
      mainnet: {
        bip32: { public: 0x0488b21e, private: 0x0488ade4 },
        pubKeyHash: 0x00,
        scriptHash: 0x05,
        wif: 0x80,
        bech32: 'bc',
      },
      testnet: {
        bip32: { public: 0x043587cf, private: 0x04358394 },
        pubKeyHash: 0x6f,
        scriptHash: 0xc4,
        wif: 0xef,
        bech32: 'tb',
      },
    },
  },
  ETHEREUM: {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    slip44: 60,
    chainId: {
      mainnet: 1,
      testnet: 11155111, // Sepolia
    },
  },
  BNB: {
    id: 'bnb',
    name: 'BNB Chain',
    symbol: 'BNB',
    decimals: 18,
    slip44: 60,
    chainId: {
      mainnet: 56,
      testnet: 97,
    },
  },
  POLYGON: {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    decimals: 18,
    slip44: 60,
    chainId: {
      mainnet: 137,
      testnet: 80001,
    },
  },
  AVALANCHE: {
    id: 'avalanche',
    name: 'Avalanche C-Chain',
    symbol: 'AVAX',
    decimals: 18,
    slip44: 60,
    chainId: {
      mainnet: 43114,
      testnet: 43113,
    },
  },
  ARBITRUM: {
    id: 'arbitrum',
    name: 'Arbitrum One',
    symbol: 'ETH',
    decimals: 18,
    slip44: 60,
    chainId: {
      mainnet: 42161,
      testnet: 421613,
    },
  },
  OPTIMISM: {
    id: 'optimism',
    name: 'Optimism',
    symbol: 'ETH',
    decimals: 18,
    slip44: 60,
    chainId: {
      mainnet: 10,
      testnet: 420,
    },
  },
  FANTOM: {
    id: 'fantom',
    name: 'Fantom',
    symbol: 'FTM',
    decimals: 18,
    slip44: 60,
    chainId: {
      mainnet: 250,
      testnet: 4002,
    },
  },
  CRONOS: {
    id: 'cronos',
    name: 'Cronos',
    symbol: 'CRO',
    decimals: 18,
    slip44: 60,
    chainId: {
      mainnet: 25,
      testnet: 338,
    },
  },
  GNOSIS: {
    id: 'gnosis',
    name: 'Gnosis Chain',
    symbol: 'xDAI',
    decimals: 18,
    slip44: 60,
    chainId: {
      mainnet: 100,
      testnet: 10200,
    },
  },
  BASE: {
    id: 'base',
    name: 'Base',
    symbol: 'ETH',
    decimals: 18,
    slip44: 60,
    chainId: {
      mainnet: 8453,
      testnet: 84531,
    },
  },
  SOLANA: {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    decimals: 9,
    slip44: 501,
    clusters: {
      mainnet: 'mainnet-beta',
      testnet: 'testnet',
      devnet: 'devnet',
    },
  },
  COSMOS: {
    id: 'cosmos',
    name: 'Cosmos Hub',
    symbol: 'ATOM',
    decimals: 6,
    slip44: 118,
    bech32Prefix: 'cosmos',
  },
  XRP: {
    id: 'xrp',
    name: 'XRP Ledger',
    symbol: 'XRP',
    decimals: 6,
    slip44: 144,
  },
  CARDANO: {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    decimals: 6,
    slip44: 1815,
    networks: {
      mainnet: 1,
      testnet: 0,
    },
  },
  POLKADOT: {
    id: 'polkadot',
    name: 'Polkadot',
    symbol: 'DOT',
    decimals: 10,
    slip44: 354,
    ss58Prefix: 0,
  },
} as const;

/**
 * Chain ID to chain configuration lookup
 */
export const CHAIN_ID_MAP: Record<number, string> = {
  1: 'ethereum',
  56: 'bnb',
  137: 'polygon',
  43114: 'avalanche',
  42161: 'arbitrum',
  10: 'optimism',
  250: 'fantom',
  25: 'cronos',
  100: 'gnosis',
  8453: 'base',
};

/**
 * EVM chain list for dropdown options
 */
export const EVM_CHAINS = [
  { name: 'Ethereum', value: 'ethereum' },
  { name: 'BNB Chain', value: 'bnb' },
  { name: 'Polygon', value: 'polygon' },
  { name: 'Avalanche C-Chain', value: 'avalanche' },
  { name: 'Arbitrum', value: 'arbitrum' },
  { name: 'Optimism', value: 'optimism' },
  { name: 'Fantom', value: 'fantom' },
  { name: 'Cronos', value: 'cronos' },
  { name: 'Gnosis Chain', value: 'gnosis' },
  { name: 'Base', value: 'base' },
  { name: 'Custom EVM', value: 'custom' },
] as const;

/**
 * Get chain configuration by ID
 */
export function getChainById(chainId: string): (typeof SUPPORTED_CHAINS)[keyof typeof SUPPORTED_CHAINS] | undefined {
  return Object.values(SUPPORTED_CHAINS).find((chain) => chain.id === chainId);
}

/**
 * Get chain configuration by EVM chain ID
 */
export function getChainByEvmId(evmChainId: number): string | undefined {
  return CHAIN_ID_MAP[evmChainId];
}
