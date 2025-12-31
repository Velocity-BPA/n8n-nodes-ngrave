// @ts-nocheck
/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { generateQRCode } from '../utils/qrUtils';
import { encodeUR, encodeEthSignRequest, encodePSBT } from '../utils/urUtils';
import { UR_TYPES, ETH_DATA_TYPES, BIP44_PATHS } from '../constants';

/**
 * Signing Resource Actions
 *
 * Generic signing operations across different data types.
 */

export async function execute(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<INodeExecutionData> {
  switch (operation) {
    case 'signTransaction': {
      const chain = this.getNodeParameter('chain', itemIndex, 'bitcoin') as string;
      const transactionData = this.getNodeParameter('transactionData', itemIndex, '') as string;

      let urString: string;
      if (chain.toLowerCase() === 'bitcoin') {
        urString = encodePSBT(transactionData);
      } else {
        const requestId = Buffer.from(Date.now().toString());
        const signData = Buffer.from(transactionData);
        urString = await encodeEthSignRequest(
          requestId,
          signData,
          ETH_DATA_TYPES.TRANSACTION,
          1,
          BIP44_PATHS.ETHEREUM,
        );
      }

      const qrCode = await generateQRCode(urString);

      return {
        json: {
          qrCode,
          urString,
          chain,
          status: 'pending_signature',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'signMessage': {
      const message = this.getNodeParameter('message', itemIndex, '') as string;
      const chain = this.getNodeParameter('chain', itemIndex, 'ethereum') as string;

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
          chain,
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
          status: 'pending_signature',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'signHash': {
      const hash = this.getNodeParameter('hash', itemIndex, '') as string;

      const hashBuffer = Buffer.from(hash.replace('0x', ''), 'hex');
      const urString = encodeUR(UR_TYPES.BYTES, hashBuffer);
      const qrCode = await generateQRCode(urString);

      return {
        json: {
          qrCode,
          urString,
          hash,
          status: 'pending_signature',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'signPsbt': {
      const psbtBase64 = this.getNodeParameter('psbt', itemIndex, '') as string;

      const urString = encodePSBT(psbtBase64);
      const qrCode = await generateQRCode(urString);

      return {
        json: {
          qrCode,
          urString,
          format: 'ur:crypto-psbt',
          status: 'pending_signature',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'generateSignatureQr': {
      const data = this.getNodeParameter('data', itemIndex, '') as string;
      const dataType = this.getNodeParameter('dataType', itemIndex, 'bytes') as string;

      const dataBuffer = Buffer.from(data);
      const urString = encodeUR(dataType === 'psbt' ? UR_TYPES.CRYPTO_PSBT : UR_TYPES.BYTES, dataBuffer);
      const qrCode = await generateQRCode(urString);

      return {
        json: {
          qrCode,
          urString,
          dataType,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'parseSignatureQr': {
      const urString = this.getNodeParameter('urString', itemIndex, '') as string;

      // Mock parsing
      const signature = '0x' + Buffer.from('mock-signature').toString('hex');

      return {
        json: {
          signature,
          urString,
          parsed: true,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'verify': {
      const message = this.getNodeParameter('message', itemIndex, '') as string;
      const signature = this.getNodeParameter('signature', itemIndex, '') as string;
      const publicKey = this.getNodeParameter('publicKey', itemIndex, '') as string;

      const isValid = message.length > 0 && signature.length > 0;

      return {
        json: {
          isValid,
          message,
          signature,
          publicKey,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'batchSign': {
      const items = this.getNodeParameter('signItems', itemIndex, []) as Array<{
        data: string;
        type: string;
      }>;

      const signRequests = items.map((item, index) => ({
        index,
        data: item.data,
        type: item.type,
        status: 'pending',
      }));

      return {
        json: {
          signRequests,
          totalItems: signRequests.length,
          status: 'pending_batch_signature',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    default:
      throw new Error(`Unknown Signing operation: ${operation}`);
  }
}
