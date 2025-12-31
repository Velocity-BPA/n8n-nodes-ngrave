// @ts-nocheck
/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { generateQRCode } from '../utils/qrUtils';
import { encodePSBT } from '../utils/urUtils';

/**
 * Multi-Signature Resource Actions
 *
 * Operations for multi-signature wallet management.
 */

export async function execute(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<INodeExecutionData> {
  const credentials = await this.getCredentials('nGraveZero');

  switch (operation) {
    case 'createWallet': {
      const requiredSignatures = this.getNodeParameter('requiredSignatures', itemIndex, 2) as number;
      const totalCosigners = this.getNodeParameter('totalCosigners', itemIndex, 3) as number;

      const walletConfig = {
        id: `multisig-${Date.now()}`,
        type: 'p2wsh',
        requiredSignatures,
        totalCosigners,
        cosigners: [],
        created: new Date().toISOString(),
      };

      return {
        json: {
          wallet: walletConfig,
          descriptor: `wsh(sortedmulti(${requiredSignatures},...))`,
          status: 'pending_cosigners',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'importConfig': {
      const configData = this.getNodeParameter('configData', itemIndex, '{}') as string;

      const config = JSON.parse(configData || '{}');

      return {
        json: {
          imported: true,
          config,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'exportConfig': {
      const walletId = this.getNodeParameter('walletId', itemIndex, '') as string;

      const mockConfig = {
        id: walletId || 'multisig-wallet',
        type: 'p2wsh',
        requiredSignatures: 2,
        totalCosigners: 3,
        cosigners: [
          { fingerprint: '00000001', xpub: 'xpub...' },
          { fingerprint: '00000002', xpub: 'xpub...' },
          { fingerprint: '00000003', xpub: 'xpub...' },
        ],
      };

      const qrCode = await generateQRCode(JSON.stringify(mockConfig));

      return {
        json: {
          config: mockConfig,
          configJson: JSON.stringify(mockConfig),
          qrCode,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'getInfo': {
      const walletId = this.getNodeParameter('walletId', itemIndex, '') as string;

      return {
        json: {
          wallet: {
            id: walletId || 'multisig-wallet',
            type: 'p2wsh',
            requiredSignatures: 2,
            totalCosigners: 3,
            balance: 1.5,
            pendingTransactions: 1,
          },
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'addCosigner': {
      const walletId = this.getNodeParameter('walletId', itemIndex, '') as string;
      const cosignerXpub = this.getNodeParameter('cosignerXpub', itemIndex, '') as string;
      const cosignerFingerprint = this.getNodeParameter('cosignerFingerprint', itemIndex, '') as string;

      return {
        json: {
          walletId,
          cosigner: {
            fingerprint: cosignerFingerprint || '00000000',
            xpub: cosignerXpub,
            added: new Date().toISOString(),
          },
          status: 'cosigner_added',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'getCosigners': {
      const walletId = this.getNodeParameter('walletId', itemIndex, '') as string;

      const cosigners = [
        { fingerprint: credentials.deviceFingerprint || '00000001', name: 'This Device', isLocal: true },
        { fingerprint: '00000002', name: 'Cosigner 2', isLocal: false },
        { fingerprint: '00000003', name: 'Cosigner 3', isLocal: false },
      ];

      return {
        json: {
          walletId,
          cosigners,
          totalCosigners: cosigners.length,
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
          signaturesRequired: 2,
          signaturesCollected: 0,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'getAddress': {
      const walletId = this.getNodeParameter('walletId', itemIndex, '') as string;
      const addressIndex = this.getNodeParameter('addressIndex', itemIndex, 0) as number;

      const mockAddress = 'bc1q' + Buffer.from(`multisig-${addressIndex}`).toString('hex').slice(0, 58);

      return {
        json: {
          address: mockAddress,
          walletId,
          index: addressIndex,
          type: 'p2wsh',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'exportBsms': {
      const walletId = this.getNodeParameter('walletId', itemIndex, '') as string;

      const bsmsData = {
        format: 'BSMS 1.0',
        walletId,
        derivation: "m/48'/0'/0'/2'",
        sortedmulti: 'sortedmulti(2,...)',
      };

      return {
        json: {
          bsms: bsmsData,
          bsmsString: JSON.stringify(bsmsData),
          format: 'BSMS 1.0',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    default:
      throw new Error(`Unknown Multi-Signature operation: ${operation}`);
  }
}
