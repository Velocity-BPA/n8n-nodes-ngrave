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
import { BIP44_PATHS, ADDRESS_TYPES, SUPPORTED_CHAINS } from '../constants';

/**
 * Bitcoin Resource Actions
 *
 * Operations for Bitcoin transactions, PSBTs, and address management.
 */

export async function execute(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<INodeExecutionData> {
  const credentials = await this.getCredentials('nGraveZero');

  switch (operation) {
    case 'getAddress': {
      const addressType = this.getNodeParameter('addressType', itemIndex, 'nativeSegwit') as string;
      const addressIndex = this.getNodeParameter('addressIndex', itemIndex, 0) as number;

      let prefix: string;
      let path: string;

      switch (addressType) {
        case 'legacy':
          prefix = '1';
          path = BIP44_PATHS.BITCOIN;
          break;
        case 'segwit':
          prefix = '3';
          path = BIP44_PATHS.BITCOIN_SEGWIT;
          break;
        case 'taproot':
          prefix = 'bc1p';
          path = BIP44_PATHS.BITCOIN_TAPROOT;
          break;
        default: // nativeSegwit
          prefix = 'bc1q';
          path = BIP44_PATHS.BITCOIN_NATIVE_SEGWIT;
      }

      const mockAddress = prefix + Buffer.from(`btc-${addressIndex}`).toString('hex').slice(0, prefix === 'bc1q' ? 38 : 32);

      return {
        json: {
          address: mockAddress,
          type: addressType,
          derivationPath: `${path}/0/${addressIndex}`,
          index: addressIndex,
          chain: 'Bitcoin',
          network: 'mainnet',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'getAddresses': {
      const addressType = this.getNodeParameter('addressType', itemIndex, 'nativeSegwit') as string;
      const count = this.getNodeParameter('count', itemIndex, 5) as number;

      const addresses = [];
      for (let i = 0; i < count; i++) {
        const prefix = addressType === 'nativeSegwit' ? 'bc1q' : addressType === 'taproot' ? 'bc1p' : '1';
        addresses.push({
          address: prefix + Buffer.from(`btc-${i}`).toString('hex').slice(0, 38),
          index: i,
          type: addressType,
        });
      }

      return {
        json: {
          addresses,
          count: addresses.length,
          type: addressType,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'getExtendedPubkey': {
      const pubkeyType = this.getNodeParameter('pubkeyType', itemIndex, 'xpub') as string;

      const prefixes: Record<string, string> = {
        xpub: 'xpub661MyMwAqRbcF',
        ypub: 'ypub6QqdH2c5z79',
        zpub: 'zpub6rFR7y4Q2AijB',
      };

      const mockPubkey = (prefixes[pubkeyType] || prefixes.xpub) + 'QCGZZEGV4ybTeveDGseFY7KHYmtKM';

      return {
        json: {
          extendedPubkey: mockPubkey,
          type: pubkeyType,
          fingerprint: credentials.deviceFingerprint || '00000000',
          derivationPath: pubkeyType === 'zpub' ? BIP44_PATHS.BITCOIN_NATIVE_SEGWIT : BIP44_PATHS.BITCOIN,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'createPsbt': {
      const inputs = this.getNodeParameter('inputs', itemIndex, []) as Array<{
        txid: string;
        vout: number;
        value: number;
      }>;
      const outputs = this.getNodeParameter('outputs', itemIndex, []) as Array<{
        address: string;
        value: number;
      }>;

      // Create mock PSBT
      const mockPsbtData = {
        version: 2,
        inputs: inputs.length > 0 ? inputs : [{ txid: '0'.repeat(64), vout: 0, value: 100000 }],
        outputs: outputs.length > 0 ? outputs : [{ address: 'bc1qmockaddress', value: 90000 }],
      };

      const psbtBase64 = Buffer.from(JSON.stringify(mockPsbtData)).toString('base64');
      const urString = encodePSBT(psbtBase64);

      return {
        json: {
          psbt: psbtBase64,
          urString,
          inputCount: mockPsbtData.inputs.length,
          outputCount: mockPsbtData.outputs.length,
          fee: 10000,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'signPsbt': {
      const psbtBase64 = this.getNodeParameter('psbt', itemIndex, '') as string;

      if (!psbtBase64) {
        throw new Error('PSBT is required');
      }

      // Mock signed PSBT
      const signedPsbt = psbtBase64 + '_signed';

      return {
        json: {
          signedPsbt,
          urString: encodePSBT(signedPsbt),
          status: 'signed',
          signedInputs: 1,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'generateSignatureQr': {
      const psbtBase64 = this.getNodeParameter('psbt', itemIndex, '') as string;

      const urString = encodePSBT(psbtBase64 || 'mock-psbt');
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

    case 'importSignatureQr': {
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

    case 'signMessage': {
      const message = this.getNodeParameter('message', itemIndex, '') as string;
      const addressIndex = this.getNodeParameter('addressIndex', itemIndex, 0) as number;

      // Mock signature
      const mockSignature = Buffer.from(`sig-${message}-${addressIndex}`).toString('base64');

      return {
        json: {
          message,
          signature: mockSignature,
          address: 'bc1q' + Buffer.from(`btc-${addressIndex}`).toString('hex').slice(0, 38),
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'verifyMessage': {
      const message = this.getNodeParameter('message', itemIndex, '') as string;
      const signature = this.getNodeParameter('signature', itemIndex, '') as string;
      const address = this.getNodeParameter('address', itemIndex, '') as string;

      // Mock verification (always returns true for valid-looking inputs)
      const isValid = message.length > 0 && signature.length > 0 && address.length > 0;

      return {
        json: {
          isValid,
          message,
          address,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'getUtxo': {
      const address = this.getNodeParameter('address', itemIndex, '') as string;

      // Mock UTXOs
      const utxos = [
        {
          txid: '0'.repeat(64),
          vout: 0,
          value: 100000,
          confirmations: 6,
          scriptPubKey: 'mock_script',
        },
      ];

      return {
        json: {
          address,
          utxos,
          totalValue: utxos.reduce((sum, u) => sum + u.value, 0),
          count: utxos.length,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'broadcast': {
      const signedTx = this.getNodeParameter('signedTx', itemIndex, '') as string;

      // Mock broadcast
      const txid = Buffer.from(`tx-${Date.now()}`).toString('hex').slice(0, 64);

      return {
        json: {
          txid,
          status: 'broadcasted',
          network: 'mainnet',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'exportWatchOnly': {
      const format = this.getNodeParameter('exportFormat', itemIndex, 'json') as string;

      const watchOnlyData = {
        xpub: 'xpub661MyMwAqRbcFQCgZZEGV4ybTeveDGseFY7KHYmtKM',
        fingerprint: credentials.deviceFingerprint || '00000000',
        derivationPath: BIP44_PATHS.BITCOIN_NATIVE_SEGWIT,
        type: 'p2wpkh',
      };

      return {
        json: {
          data: watchOnlyData,
          format,
          exported: true,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    default:
      throw new Error(`Unknown Bitcoin operation: ${operation}`);
  }
}
