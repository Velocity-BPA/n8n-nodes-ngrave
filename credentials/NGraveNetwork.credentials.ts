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
 * NGRAVE Network Credentials
 *
 * Configuration for blockchain network connections used with NGRAVE operations.
 * Supports multiple chains including Bitcoin, Ethereum, and various EVM networks.
 */
export class NGraveNetwork implements ICredentialType {
  name = 'nGraveNetwork';
  displayName = 'NGRAVE Network';
  documentationUrl = 'https://docs.ngrave.io/networks/';
  icon = 'file:ngrave.svg' as const;

  properties: INodeProperties[] = [
    {
      displayName: 'Blockchain Network',
      name: 'network',
      type: 'options',
      options: [
        { name: 'Bitcoin', value: 'bitcoin' },
        { name: 'Ethereum', value: 'ethereum' },
        { name: 'BNB Chain', value: 'bnb' },
        { name: 'Polygon', value: 'polygon' },
        { name: 'Avalanche C-Chain', value: 'avalanche' },
        { name: 'Arbitrum', value: 'arbitrum' },
        { name: 'Optimism', value: 'optimism' },
        { name: 'Fantom', value: 'fantom' },
        { name: 'Cronos', value: 'cronos' },
        { name: 'Gnosis Chain', value: 'gnosis' },
        { name: 'Base', value: 'base' },
        { name: 'Solana', value: 'solana' },
        { name: 'Cosmos', value: 'cosmos' },
        { name: 'XRP Ledger', value: 'xrp' },
        { name: 'Cardano', value: 'cardano' },
        { name: 'Polkadot', value: 'polkadot' },
        { name: 'Custom EVM', value: 'custom' },
      ],
      default: 'bitcoin',
      description: 'Select the blockchain network',
    },
    {
      displayName: 'Network Environment',
      name: 'environment',
      type: 'options',
      options: [
        { name: 'Mainnet', value: 'mainnet' },
        { name: 'Testnet', value: 'testnet' },
      ],
      default: 'mainnet',
      description: 'Mainnet for production, Testnet for development',
    },
    {
      displayName: 'RPC Endpoint URL',
      name: 'rpcUrl',
      type: 'string',
      default: '',
      placeholder: 'https://mainnet.infura.io/v3/YOUR_KEY',
      required: true,
      description: 'RPC endpoint URL for the blockchain network',
    },
    {
      displayName: 'RPC API Key',
      name: 'rpcApiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'API key for the RPC provider (if required)',
    },
    {
      displayName: 'Block Explorer URL',
      name: 'explorerUrl',
      type: 'string',
      default: '',
      placeholder: 'https://etherscan.io',
      description: 'Block explorer URL for transaction viewing',
    },
    {
      displayName: 'Block Explorer API Key',
      name: 'explorerApiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'API key for block explorer (for advanced queries)',
    },
    {
      displayName: 'Chain ID',
      name: 'chainId',
      type: 'number',
      default: 1,
      displayOptions: {
        show: {
          network: [
            'ethereum',
            'bnb',
            'polygon',
            'avalanche',
            'arbitrum',
            'optimism',
            'fantom',
            'cronos',
            'gnosis',
            'base',
            'custom',
          ],
        },
      },
      description: 'Chain ID for EVM-compatible networks',
    },
    {
      displayName: 'Custom Network Name',
      name: 'customNetworkName',
      type: 'string',
      default: '',
      displayOptions: {
        show: {
          network: ['custom'],
        },
      },
      description: 'Name for the custom network',
    },
    {
      displayName: 'Native Token Symbol',
      name: 'nativeToken',
      type: 'string',
      default: '',
      placeholder: 'ETH',
      displayOptions: {
        show: {
          network: ['custom'],
        },
      },
      description: 'Symbol of the native token on this network',
    },
    {
      displayName: 'Token Decimals',
      name: 'tokenDecimals',
      type: 'number',
      default: 18,
      displayOptions: {
        show: {
          network: ['custom'],
        },
      },
      description: 'Decimal places for the native token',
    },
    {
      displayName: 'Connection Timeout (ms)',
      name: 'timeout',
      type: 'number',
      default: 30000,
      typeOptions: {
        minValue: 5000,
        maxValue: 120000,
      },
      description: 'Connection timeout in milliseconds',
    },
    {
      displayName: 'Max Retries',
      name: 'maxRetries',
      type: 'number',
      default: 3,
      typeOptions: {
        minValue: 0,
        maxValue: 10,
      },
      description: 'Maximum number of retry attempts for failed requests',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {},
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.rpcUrl}}',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_chainId',
        params: [],
        id: 1,
      }),
      skipSslCertificateValidation: true,
    },
  };
}
