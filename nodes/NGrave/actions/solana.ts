// @ts-nocheck
/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { generateQRCode } from '../utils/qrUtils';
import { encodeUR } from '../utils/urUtils';
import { BIP44_PATHS, SUPPORTED_CHAINS, UR_TYPES } from '../constants';

/**
 * Solana Resource Actions
 *
 * Operations for Solana transactions and signing.
 */

export async function execute(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<INodeExecutionData> {
  const chainInfo = SUPPORTED_CHAINS.SOLANA;

  switch (operation) {
    case 'getAddress': {
      const addressIndex = this.getNodeParameter('addressIndex', itemIndex, 0) as number;

      // Mock Solana address (base58 encoded, 32-44 chars)
      const mockAddress = Buffer.from(`sol-${addressIndex}-${Date.now()}`)
        .toString('base64')
        .replace(/[+/=]/g, '')
        .slice(0, 44);

      return {
        json: {
          address: mockAddress,
          derivationPath: `${BIP44_PATHS.SOLANA}/0'/${addressIndex}'`,
          index: addressIndex,
          chain: 'Solana',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'signTransaction': {
      const transaction = this.getNodeParameter('transaction', itemIndex, '') as string;

      const txBuffer = Buffer.from(transaction || 'mock-sol-tx');
      const urString = encodeUR(UR_TYPES.SOL_SIGN_REQUEST, txBuffer);
      const qrCode = await generateQRCode(urString);

      return {
        json: {
          qrCode,
          urString,
          format: 'ur:sol-sign-request',
          status: 'pending_signature',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'signMessage': {
      const message = this.getNodeParameter('message', itemIndex, '') as string;

      const msgBuffer = Buffer.from(message);
      const urString = encodeUR(UR_TYPES.SOL_SIGN_REQUEST, msgBuffer);
      const qrCode = await generateQRCode(urString);

      return {
        json: {
          qrCode,
          urString,
          message,
          format: 'ur:sol-sign-request',
          status: 'pending_signature',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'generateSignatureQr': {
      const data = this.getNodeParameter('data', itemIndex, '') as string;

      const dataBuffer = Buffer.from(data || 'mock-data');
      const urString = encodeUR(UR_TYPES.SOL_SIGN_REQUEST, dataBuffer);
      const qrCode = await generateQRCode(urString);

      return {
        json: {
          qrCode,
          urString,
          format: 'ur:sol-sign-request',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'importSignature': {
      const signature = this.getNodeParameter('signature', itemIndex, '') as string;

      return {
        json: {
          signature,
          chain: 'Solana',
          imported: true,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'broadcast': {
      const signedTx = this.getNodeParameter('signedTx', itemIndex, '') as string;

      const txSignature = Buffer.from(`sol-sig-${Date.now()}`)
        .toString('base64')
        .replace(/[+/=]/g, '')
        .slice(0, 88);

      return {
        json: {
          signature: txSignature,
          status: 'broadcasted',
          network: 'mainnet-beta',
          explorerUrl: `${chainInfo.explorerUrl}/tx/${txSignature}`,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'getBalance': {
      const address = this.getNodeParameter('address', itemIndex, '') as string;

      return {
        json: {
          address,
          balance: '5000000000', // 5 SOL in lamports
          balanceSol: '5.0',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    default:
      throw new Error(`Unknown Solana operation: ${operation}`);
  }
}
