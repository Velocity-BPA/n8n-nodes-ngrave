// @ts-nocheck
/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { generateQRCode } from '../utils/qrUtils';
import { encodeEthSignRequest, decodeEthSignature } from '../utils/urUtils';
import { BIP44_PATHS, SUPPORTED_CHAINS, ETH_DATA_TYPES } from '../constants';

/**
 * Ethereum Resource Actions
 *
 * Operations for Ethereum transactions, signing, and address management.
 */

export async function execute(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<INodeExecutionData> {
  const credentials = await this.getCredentials('nGraveZero');

  switch (operation) {
    case 'getAddress': {
      const addressIndex = this.getNodeParameter('addressIndex', itemIndex, 0) as number;

      const mockAddress = '0x' + Buffer.from(`eth-${addressIndex}-${Date.now()}`).toString('hex').slice(0, 40);

      return {
        json: {
          address: mockAddress,
          derivationPath: `${BIP44_PATHS.ETHEREUM}/0/${addressIndex}`,
          index: addressIndex,
          chain: 'Ethereum',
          chainId: 1,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'signTransaction': {
      const to = this.getNodeParameter('to', itemIndex, '') as string;
      const value = this.getNodeParameter('value', itemIndex, '0') as string;
      const data = this.getNodeParameter('data', itemIndex, '0x') as string;
      const nonce = this.getNodeParameter('nonce', itemIndex, 0) as number;
      const gasLimit = this.getNodeParameter('gasLimit', itemIndex, 21000) as number;

      const txData = {
        to,
        value,
        data,
        nonce,
        gasLimit,
        chainId: 1,
      };

      // Create sign request
      const requestId = Buffer.from(Date.now().toString());
      const signData = Buffer.from(JSON.stringify(txData));
      const urString = await encodeEthSignRequest(
        requestId,
        signData,
        ETH_DATA_TYPES.TRANSACTION,
        1,
        BIP44_PATHS.ETHEREUM,
      );

      const qrCode = await generateQRCode(urString);

      return {
        json: {
          qrCode,
          urString,
          transaction: txData,
          requestId: requestId.toString('hex'),
          status: 'pending_signature',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'signTypedData': {
      const typedData = this.getNodeParameter('typedData', itemIndex, '{}') as string;

      const requestId = Buffer.from(Date.now().toString());
      const signData = Buffer.from(typedData);
      const urString = await encodeEthSignRequest(
        requestId,
        signData,
        ETH_DATA_TYPES.TYPED_DATA,
        1,
        BIP44_PATHS.ETHEREUM,
      );

      const qrCode = await generateQRCode(urString);

      return {
        json: {
          qrCode,
          urString,
          dataType: 'EIP-712',
          requestId: requestId.toString('hex'),
          status: 'pending_signature',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'signMessage': {
      const message = this.getNodeParameter('message', itemIndex, '') as string;

      const requestId = Buffer.from(Date.now().toString());
      const signData = Buffer.from(message);
      const urString = await encodeEthSignRequest(
        requestId,
        signData,
        ETH_DATA_TYPES.PERSONAL_MESSAGE,
        1,
        BIP44_PATHS.ETHEREUM,
      );

      const qrCode = await generateQRCode(urString);

      return {
        json: {
          qrCode,
          urString,
          message,
          requestId: requestId.toString('hex'),
          status: 'pending_signature',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'signEip1559Transaction': {
      const to = this.getNodeParameter('to', itemIndex, '') as string;
      const value = this.getNodeParameter('value', itemIndex, '0') as string;
      const maxFeePerGas = this.getNodeParameter('maxFeePerGas', itemIndex, '0') as string;
      const maxPriorityFeePerGas = this.getNodeParameter('maxPriorityFeePerGas', itemIndex, '0') as string;

      const txData = {
        type: 2,
        to,
        value,
        maxFeePerGas,
        maxPriorityFeePerGas,
        chainId: 1,
      };

      const requestId = Buffer.from(Date.now().toString());
      const signData = Buffer.from(JSON.stringify(txData));
      const urString = await encodeEthSignRequest(
        requestId,
        signData,
        ETH_DATA_TYPES.TRANSACTION,
        1,
        BIP44_PATHS.ETHEREUM,
      );

      const qrCode = await generateQRCode(urString);

      return {
        json: {
          qrCode,
          urString,
          transaction: txData,
          transactionType: 'EIP-1559',
          requestId: requestId.toString('hex'),
          status: 'pending_signature',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'generateSignatureQr': {
      const txData = this.getNodeParameter('transactionData', itemIndex, '{}') as string;

      const requestId = Buffer.from(Date.now().toString());
      const signData = Buffer.from(txData);
      const urString = await encodeEthSignRequest(
        requestId,
        signData,
        ETH_DATA_TYPES.TRANSACTION,
        1,
        BIP44_PATHS.ETHEREUM,
      );

      const qrCode = await generateQRCode(urString);

      return {
        json: {
          qrCode,
          urString,
          format: 'ur:eth-sign-request',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'importSignatureQr': {
      const urString = this.getNodeParameter('urString', itemIndex, '') as string;

      const { requestId, signature } = await decodeEthSignature(urString);

      const r = '0x' + signature.slice(0, 32).toString('hex');
      const s = '0x' + signature.slice(32, 64).toString('hex');
      const v = signature[64];

      return {
        json: {
          signature: '0x' + signature.toString('hex'),
          r,
          s,
          v,
          requestId: requestId.toString('hex'),
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'broadcast': {
      const signedTx = this.getNodeParameter('signedTx', itemIndex, '') as string;

      // Mock broadcast
      const txHash = '0x' + Buffer.from(`eth-tx-${Date.now()}`).toString('hex').slice(0, 64);

      return {
        json: {
          txHash,
          status: 'broadcasted',
          network: 'mainnet',
          chainId: 1,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'getBalance': {
      const address = this.getNodeParameter('address', itemIndex, '') as string;

      // Mock balance
      const balance = '1000000000000000000'; // 1 ETH in wei

      return {
        json: {
          address,
          balance,
          balanceEth: '1.0',
          chainId: 1,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'getAccountInfo': {
      const address = this.getNodeParameter('address', itemIndex, '') as string;

      return {
        json: {
          address,
          balance: '1000000000000000000',
          nonce: 5,
          chainId: 1,
          isContract: false,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    default:
      throw new Error(`Unknown Ethereum operation: ${operation}`);
  }
}
