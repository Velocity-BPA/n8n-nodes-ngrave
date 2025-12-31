/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

/**
 * NGRAVE ZERO Hardware Wallet Credentials
 *
 * Supports air-gapped QR code communication and LIQUID app integration.
 * The NGRAVE ZERO is an EAL7 certified hardware wallet that operates
 * completely offline, using QR codes for all data transfer.
 */
export class NGraveZero implements ICredentialType {
  name = 'nGraveZero';
  displayName = 'NGRAVE ZERO';
  documentationUrl = 'https://docs.ngrave.io/';
  icon = 'file:ngrave.svg' as const;

  properties: INodeProperties[] = [
    {
      displayName: 'Connection Type',
      name: 'connectionType',
      type: 'options',
      options: [
        {
          name: 'QR Code (Air-Gapped)',
          value: 'qr',
          description: 'Primary method - fully air-gapped communication via QR codes',
        },
        {
          name: 'LIQUID App Integration',
          value: 'liquid',
          description: 'Connect through the NGRAVE LIQUID companion app',
        },
      ],
      default: 'qr',
      description: 'Method to communicate with the NGRAVE ZERO device',
    },
    {
      displayName: 'QR Scan Method',
      name: 'qrScanMethod',
      type: 'options',
      options: [
        {
          name: 'Camera Scan',
          value: 'camera',
          description: 'Scan QR codes using device camera',
        },
        {
          name: 'File Upload',
          value: 'file',
          description: 'Upload QR code images from files',
        },
        {
          name: 'Base64 Input',
          value: 'base64',
          description: 'Provide QR code data as base64 string',
        },
      ],
      default: 'file',
      displayOptions: {
        show: {
          connectionType: ['qr'],
        },
      },
      description: 'How to input QR code data from ZERO device',
    },
    {
      displayName: 'Animated QR Frame Rate',
      name: 'qrFrameRate',
      type: 'number',
      default: 10,
      typeOptions: {
        minValue: 1,
        maxValue: 30,
      },
      displayOptions: {
        show: {
          connectionType: ['qr'],
        },
      },
      description: 'Frames per second for animated QR code sequences',
    },
    {
      displayName: 'Animated QR Fragment Size',
      name: 'qrFragmentSize',
      type: 'number',
      default: 200,
      typeOptions: {
        minValue: 50,
        maxValue: 500,
      },
      displayOptions: {
        show: {
          connectionType: ['qr'],
        },
      },
      description: 'Maximum bytes per QR code fragment for animated sequences',
    },
    {
      displayName: 'LIQUID App Endpoint',
      name: 'liquidEndpoint',
      type: 'string',
      default: '',
      placeholder: 'e.g., 192.168.1.100:8080',
      displayOptions: {
        show: {
          connectionType: ['liquid'],
        },
      },
      description: 'Local network endpoint for LIQUID app connection',
    },
    {
      displayName: 'LIQUID Connection Token',
      name: 'liquidToken',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      displayOptions: {
        show: {
          connectionType: ['liquid'],
        },
      },
      description: 'Authentication token for LIQUID app pairing',
    },
    {
      displayName: 'Device Fingerprint',
      name: 'deviceFingerprint',
      type: 'string',
      default: '',
      placeholder: 'e.g., 73C5DA0A',
      description:
        'Master fingerprint of the ZERO device (8 hex characters). Used to verify device identity.',
    },
    {
      displayName: 'Wallet Label',
      name: 'walletLabel',
      type: 'string',
      default: 'NGRAVE ZERO',
      description: 'Custom label to identify this wallet configuration',
    },
    {
      displayName: 'Default Network',
      name: 'defaultNetwork',
      type: 'options',
      options: [
        { name: 'Mainnet', value: 'mainnet' },
        { name: 'Testnet', value: 'testnet' },
      ],
      default: 'mainnet',
      description: 'Default network for operations',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {},
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.liquidEndpoint}}',
      url: '/health',
      method: 'GET',
      skipSslCertificateValidation: true,
    },
  };
}
