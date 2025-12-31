// @ts-nocheck
/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { generateQRCode } from '../utils/qrUtils';
import { BIP44_PATHS } from '../constants';

/**
 * Watch-Only Export Resource Actions
 *
 * Operations for exporting watch-only wallet configurations.
 */

export async function execute(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<INodeExecutionData> {
  const credentials = await this.getCredentials('nGraveZero');
  const fingerprint = credentials.deviceFingerprint || '00000000';
  const mockXpub = 'xpub661MyMwAqRbcFQCgZZEGV4ybTeveDGseFY7KHYmtKM';
  const mockZpub = 'zpub6rFR7y4Q2AijBQCgZZEGV4ybTeveDGseFY7KHYmtKM';

  switch (operation) {
    case 'exportLiquid': {
      const exportData = {
        format: 'LIQUID',
        fingerprint,
        xpub: mockXpub,
        derivation: BIP44_PATHS.BITCOIN_NATIVE_SEGWIT,
      };

      const qrCode = await generateQRCode(JSON.stringify(exportData));

      return {
        json: {
          exportData,
          qrCode,
          format: 'LIQUID',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'exportSparrow': {
      const sparrowFormat = {
        label: 'NGRAVE ZERO',
        masterFingerprint: fingerprint,
        accountKeyPath: BIP44_PATHS.BITCOIN_NATIVE_SEGWIT,
        extendedPublicKey: mockZpub,
      };

      const qrCode = await generateQRCode(JSON.stringify(sparrowFormat));

      return {
        json: {
          exportData: sparrowFormat,
          qrCode,
          format: 'Sparrow',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'exportBlueWallet': {
      const blueWalletFormat = {
        ExtPubKey: mockZpub,
        MasterFingerprint: fingerprint,
        AccountKeyPath: "84'/0'/0'",
        CoboVaultFirmware: 'n/a',
      };

      const qrCode = await generateQRCode(JSON.stringify(blueWalletFormat));

      return {
        json: {
          exportData: blueWalletFormat,
          qrCode,
          format: 'BlueWallet',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'exportElectrum': {
      const electrumFormat = {
        keystore: {
          type: 'hardware',
          hw_type: 'ngrave',
          xpub: mockZpub,
          derivation: BIP44_PATHS.BITCOIN_NATIVE_SEGWIT,
          root_fingerprint: fingerprint,
        },
      };

      return {
        json: {
          exportData: electrumFormat,
          exportJson: JSON.stringify(electrumFormat, null, 2),
          format: 'Electrum',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'exportBitcoinCore': {
      const descriptor = `wpkh([${fingerprint}/84'/0'/0']${mockZpub}/0/*)`;
      const changeDescriptor = `wpkh([${fingerprint}/84'/0'/0']${mockZpub}/1/*)`;

      return {
        json: {
          descriptor,
          changeDescriptor,
          format: 'Bitcoin Core',
          importCommand: `importdescriptors '[{"desc":"${descriptor}","timestamp":"now"}]'`,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'exportJson': {
      const jsonExport = {
        device: 'NGRAVE ZERO',
        fingerprint,
        accounts: [
          {
            type: 'p2wpkh',
            derivation: BIP44_PATHS.BITCOIN_NATIVE_SEGWIT,
            xpub: mockZpub,
          },
          {
            type: 'p2sh-p2wpkh',
            derivation: BIP44_PATHS.BITCOIN_SEGWIT,
            xpub: mockXpub,
          },
        ],
        timestamp: new Date().toISOString(),
      };

      return {
        json: {
          exportData: jsonExport,
          exportJson: JSON.stringify(jsonExport, null, 2),
          format: 'JSON',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'exportDescriptor': {
      const addressType = this.getNodeParameter('addressType', itemIndex, 'nativeSegwit') as string;

      let descriptor: string;
      let pubkey: string;

      switch (addressType) {
        case 'legacy':
          pubkey = mockXpub;
          descriptor = `pkh([${fingerprint}/44'/0'/0']${pubkey}/0/*)`;
          break;
        case 'segwit':
          pubkey = mockXpub;
          descriptor = `sh(wpkh([${fingerprint}/49'/0'/0']${pubkey}/0/*))`;
          break;
        case 'taproot':
          pubkey = mockXpub;
          descriptor = `tr([${fingerprint}/86'/0'/0']${pubkey}/0/*)`;
          break;
        default: // nativeSegwit
          pubkey = mockZpub;
          descriptor = `wpkh([${fingerprint}/84'/0'/0']${pubkey}/0/*)`;
      }

      return {
        json: {
          descriptor,
          addressType,
          fingerprint,
          xpub: pubkey,
          format: 'Output Descriptor',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'getQr': {
      const format = this.getNodeParameter('exportFormat', itemIndex, 'json') as string;

      const exportData = {
        format,
        fingerprint,
        xpub: mockZpub,
        derivation: BIP44_PATHS.BITCOIN_NATIVE_SEGWIT,
      };

      const qrCode = await generateQRCode(JSON.stringify(exportData));

      return {
        json: {
          qrCode,
          format,
          exportData,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    default:
      throw new Error(`Unknown Watch-Only Export operation: ${operation}`);
  }
}
