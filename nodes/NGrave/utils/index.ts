// @ts-nocheck
/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export * from './qrUtils';
export * from './urUtils';
export * from './securityUtils';
export * from './grapheneUtils';

/**
 * Validate a cryptocurrency address
 */
export function validateAddress(address: string, chain: string): { valid: boolean; error?: string } {
  if (!address || address.trim() === '') {
    return { valid: false, error: 'Address is empty' };
  }

  switch (chain.toLowerCase()) {
    case 'bitcoin':
      // Bitcoin addresses start with 1, 3, bc1q, or bc1p
      if (/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address) ||
          /^bc1[qp][a-z0-9]{38,58}$/.test(address)) {
        return { valid: true };
      }
      return { valid: false, error: 'Invalid Bitcoin address format' };

    case 'ethereum':
    case 'polygon':
    case 'bnb':
    case 'arbitrum':
    case 'optimism':
    case 'avalanche':
    case 'base':
    case 'fantom':
    case 'cronos':
    case 'gnosis':
      // EVM addresses
      if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return { valid: true };
      }
      return { valid: false, error: 'Invalid EVM address format' };

    case 'solana':
      // Solana addresses are base58 encoded
      if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
        return { valid: true };
      }
      return { valid: false, error: 'Invalid Solana address format' };

    case 'cosmos':
      if (/^cosmos1[a-z0-9]{38}$/.test(address)) {
        return { valid: true };
      }
      return { valid: false, error: 'Invalid Cosmos address format' };

    case 'xrp':
      if (/^r[1-9A-HJ-NP-Za-km-z]{24,34}$/.test(address)) {
        return { valid: true };
      }
      return { valid: false, error: 'Invalid XRP address format' };

    case 'cardano':
      if (/^addr1[a-z0-9]{50,100}$/.test(address)) {
        return { valid: true };
      }
      return { valid: false, error: 'Invalid Cardano address format' };

    case 'polkadot':
      if (/^1[a-zA-Z0-9]{46,47}$/.test(address)) {
        return { valid: true };
      }
      return { valid: false, error: 'Invalid Polkadot address format' };

    default:
      return { valid: true }; // Unknown chain, allow
  }
}

/**
 * Validate a BIP derivation path
 */
export function isValidDerivationPath(path: string): boolean {
  // Standard BIP derivation path pattern
  const pattern = /^m(\/\d+'?)+$/;
  return pattern.test(path);
}
