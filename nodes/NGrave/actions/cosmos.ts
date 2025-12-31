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
 * Cosmos Resource Actions
 *
 * Operations for Cosmos ecosystem chains.
 */

export async function execute(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<INodeExecutionData> {
  const chainInfo = SUPPORTED_CHAINS.COSMOS;

  switch (operation) {
    case 'getAddress': {
      const addressIndex = this.getNodeParameter('addressIndex', itemIndex, 0) as number;

      const mockAddress = 'cosmos1' + Buffer.from(`cosmos-${addressIndex}`)
        .toString('hex')
        .slice(0, 38);

      return {
        json: {
          address: mockAddress,
          derivationPath: `${BIP44_PATHS.COSMOS}/0/${addressIndex}`,
          index: addressIndex,
          chain: 'Cosmos',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'signTransaction': {
      const transaction = this.getNodeParameter('transaction', itemIndex, '') as string;

      const txBuffer = Buffer.from(transaction || 'mock-cosmos-tx');
      const urString = encodeUR(UR_TYPES.BYTES, txBuffer);
      const qrCode = await generateQRCode(urString);

      return {
        json: {
          qrCode,
          urString,
          chain: 'Cosmos',
          status: 'pending_signature',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'signMessage': {
      const message = this.getNodeParameter('message', itemIndex, '') as string;

      const msgBuffer = Buffer.from(message);
      const urString = encodeUR(UR_TYPES.BYTES, msgBuffer);
      const qrCode = await generateQRCode(urString);

      return {
        json: {
          qrCode,
          urString,
          message,
          chain: 'Cosmos',
          status: 'pending_signature',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'broadcast': {
      const signedTx = this.getNodeParameter('signedTx', itemIndex, '') as string;

      const txHash = Buffer.from(`cosmos-tx-${Date.now()}`).toString('hex').toUpperCase().slice(0, 64);

      return {
        json: {
          txHash,
          status: 'broadcasted',
          chain: 'Cosmos',
          explorerUrl: `${chainInfo.explorerUrl}/txs/${txHash}`,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    default:
      throw new Error(`Unknown Cosmos operation: ${operation}`);
  }
}
