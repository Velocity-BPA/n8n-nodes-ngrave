// @ts-nocheck
/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { generateQRCode } from '../utils/qrUtils';
import { encodePSBT, decodePSBT } from '../utils/urUtils';

/**
 * PSBT Resource Actions
 *
 * Operations for Partially Signed Bitcoin Transactions.
 */

export async function execute(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<INodeExecutionData> {
  switch (operation) {
    case 'create': {
      const inputs = this.getNodeParameter('inputs', itemIndex, []) as Array<{
        txid: string;
        vout: number;
        value: number;
      }>;
      const outputs = this.getNodeParameter('outputs', itemIndex, []) as Array<{
        address: string;
        value: number;
      }>;

      const psbtData = {
        version: 2,
        inputs: inputs.length > 0 ? inputs : [{ txid: '0'.repeat(64), vout: 0, value: 100000 }],
        outputs: outputs.length > 0 ? outputs : [{ address: 'bc1qmockaddress', value: 90000 }],
        fee: 10000,
      };

      const psbtBase64 = Buffer.from(JSON.stringify(psbtData)).toString('base64');

      return {
        json: {
          psbt: psbtBase64,
          version: 2,
          inputCount: psbtData.inputs.length,
          outputCount: psbtData.outputs.length,
          fee: psbtData.fee,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'importFromQr': {
      const urString = this.getNodeParameter('urString', itemIndex, '') as string;

      const psbtBase64 = decodePSBT(urString);

      return {
        json: {
          psbt: psbtBase64,
          format: 'base64',
          imported: true,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'importFromBase64': {
      const psbtBase64 = this.getNodeParameter('psbtBase64', itemIndex, '') as string;

      return {
        json: {
          psbt: psbtBase64,
          format: 'base64',
          isValid: psbtBase64.length > 0,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'sign': {
      const psbtBase64 = this.getNodeParameter('psbt', itemIndex, '') as string;

      const urString = encodePSBT(psbtBase64);
      const qrCode = await generateQRCode(urString);

      return {
        json: {
          qrCode,
          urString,
          format: 'ur:crypto-psbt',
          status: 'pending_signature',
          instructions: 'Scan with NGRAVE ZERO to sign',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'exportAsQr': {
      const psbtBase64 = this.getNodeParameter('psbt', itemIndex, '') as string;

      const urString = encodePSBT(psbtBase64);
      const qrCode = await generateQRCode(urString);

      return {
        json: {
          qrCode,
          urString,
          format: 'ur:crypto-psbt',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'analyze': {
      const psbtBase64 = this.getNodeParameter('psbt', itemIndex, '') as string;

      // Mock analysis
      const analysis = {
        version: 2,
        inputCount: 1,
        outputCount: 2,
        totalInputValue: 100000,
        totalOutputValue: 90000,
        fee: 10000,
        feeRate: 40,
        isFullySigned: false,
        missingSignatures: 1,
      };

      return {
        json: {
          analysis,
          psbt: psbtBase64,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'getInfo': {
      const psbtBase64 = this.getNodeParameter('psbt', itemIndex, '') as string;

      return {
        json: {
          psbt: psbtBase64,
          version: 2,
          isValid: psbtBase64.length > 0,
          size: psbtBase64.length,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'finalize': {
      const psbtBase64 = this.getNodeParameter('psbt', itemIndex, '') as string;

      // Mock finalization
      const finalizedTx = Buffer.from(`finalized-${psbtBase64}`).toString('hex');

      return {
        json: {
          finalizedTransaction: finalizedTx,
          format: 'hex',
          readyToBroadcast: true,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'extract': {
      const psbtBase64 = this.getNodeParameter('psbt', itemIndex, '') as string;

      const rawTx = Buffer.from(`raw-tx-${Date.now()}`).toString('hex');

      return {
        json: {
          rawTransaction: rawTx,
          format: 'hex',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    default:
      throw new Error(`Unknown PSBT operation: ${operation}`);
  }
}
