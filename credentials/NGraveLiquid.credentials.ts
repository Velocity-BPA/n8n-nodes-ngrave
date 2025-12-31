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
 * NGRAVE LIQUID Companion App Credentials
 *
 * The LIQUID app serves as a bridge between your NGRAVE ZERO
 * and the blockchain networks. It manages watch-only accounts,
 * broadcasts transactions, and syncs portfolio data.
 */
export class NGraveLiquid implements ICredentialType {
  name = 'nGraveLiquid';
  displayName = 'NGRAVE LIQUID';
  documentationUrl = 'https://docs.ngrave.io/liquid/';
  icon = 'file:ngrave.svg' as const;

  properties: INodeProperties[] = [
    {
      displayName: 'API Endpoint',
      name: 'apiEndpoint',
      type: 'string',
      default: '',
      placeholder: 'e.g., http://192.168.1.100:8080',
      required: true,
      description: 'Local network endpoint where LIQUID app API is accessible',
    },
    {
      displayName: 'App Authorization Token',
      name: 'authToken',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'Authorization token from LIQUID app pairing process',
    },
    {
      displayName: 'Device Binding ID',
      name: 'deviceBindingId',
      type: 'string',
      default: '',
      required: true,
      description: 'Unique identifier linking this LIQUID instance to a ZERO device',
    },
    {
      displayName: 'Sync Interval (Seconds)',
      name: 'syncInterval',
      type: 'number',
      default: 300,
      typeOptions: {
        minValue: 60,
        maxValue: 3600,
      },
      description: 'How often to sync portfolio data from LIQUID',
    },
    {
      displayName: 'Enable Portfolio Tracking',
      name: 'enablePortfolio',
      type: 'boolean',
      default: true,
      description: 'Whether to sync portfolio balances and values',
    },
    {
      displayName: 'Enable Transaction History',
      name: 'enableHistory',
      type: 'boolean',
      default: true,
      description: 'Whether to sync transaction history',
    },
    {
      displayName: 'Notification Webhook URL',
      name: 'webhookUrl',
      type: 'string',
      default: '',
      placeholder: 'https://your-server.com/webhook',
      description: 'Optional webhook URL for transaction notifications from LIQUID',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.authToken}}',
        'X-Device-Binding': '={{$credentials.deviceBindingId}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.apiEndpoint}}',
      url: '/api/v1/health',
      method: 'GET',
      skipSslCertificateValidation: true,
    },
  };
}
