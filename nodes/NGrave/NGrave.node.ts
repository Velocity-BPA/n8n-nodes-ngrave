/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import { logLicensingNotice } from './constants';

// Import action handlers
import * as device from './actions/device';
import * as graphene from './actions/graphene';
import * as account from './actions/account';
import * as qrCode from './actions/qrCode';
import * as bitcoin from './actions/bitcoin';
import * as ethereum from './actions/ethereum';
import * as evmChains from './actions/evmChains';
import * as solana from './actions/solana';
import * as cosmos from './actions/cosmos';
import * as xrp from './actions/xrp';
import * as cardano from './actions/cardano';
import * as polkadot from './actions/polkadot';
import * as multiChain from './actions/multiChain';
import * as transaction from './actions/transaction';
import * as psbt from './actions/psbt';
import * as signing from './actions/signing';
import * as multisig from './actions/multisig';
import * as watchOnly from './actions/watchOnly';
import * as liquid from './actions/liquid';
import * as biometric from './actions/biometric';
import * as pin from './actions/pin';
import * as backup from './actions/backup';
import * as security from './actions/security';
import * as firmware from './actions/firmware';
import * as utility from './actions/utility';

// Log licensing notice once on module load
logLicensingNotice();

export class NGrave implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'NGRAVE ZERO',
    name: 'nGrave',
    icon: 'file:ngrave.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with NGRAVE ZERO hardware wallet for air-gapped cryptocurrency operations',
    defaults: {
      name: 'NGRAVE ZERO',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'nGraveZero',
        required: true,
      },
      {
        name: 'nGraveLiquid',
        required: false,
      },
      {
        name: 'nGraveNetwork',
        required: false,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Account', value: 'account' },
          { name: 'Backup', value: 'backup' },
          { name: 'Biometric', value: 'biometric' },
          { name: 'Bitcoin', value: 'bitcoin' },
          { name: 'Cardano', value: 'cardano' },
          { name: 'Cosmos', value: 'cosmos' },
          { name: 'Device', value: 'device' },
          { name: 'Ethereum', value: 'ethereum' },
          { name: 'EVM Chains', value: 'evmChains' },
          { name: 'Firmware', value: 'firmware' },
          { name: 'GRAPHENE', value: 'graphene' },
          { name: 'LIQUID', value: 'liquid' },
          { name: 'Multi-Chain', value: 'multiChain' },
          { name: 'Multi-Signature', value: 'multisig' },
          { name: 'PIN', value: 'pin' },
          { name: 'Polkadot', value: 'polkadot' },
          { name: 'PSBT', value: 'psbt' },
          { name: 'QR Code', value: 'qrCode' },
          { name: 'Security', value: 'security' },
          { name: 'Signing', value: 'signing' },
          { name: 'Solana', value: 'solana' },
          { name: 'Transaction', value: 'transaction' },
          { name: 'Utility', value: 'utility' },
          { name: 'Watch-Only Export', value: 'watchOnly' },
          { name: 'XRP', value: 'xrp' },
        ],
        default: 'device',
      },

      // Device operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['device'] } },
        options: [
          { name: 'Check Tamper Status', value: 'checkTamperStatus' },
          { name: 'Get Battery Status', value: 'getBatteryStatus' },
          { name: 'Get Biometric Status', value: 'getBiometricStatus' },
          { name: 'Get Device ID', value: 'getDeviceId' },
          { name: 'Get Device Info', value: 'getDeviceInfo' },
          { name: 'Get Firmware Version', value: 'getFirmwareVersion' },
          { name: 'Get Light Sensor Status', value: 'getLightSensorStatus' },
          { name: 'Get Master Fingerprint', value: 'getMasterFingerprint' },
          { name: 'Get Screen Status', value: 'getScreenStatus' },
          { name: 'Get Security Status', value: 'getSecurityStatus' },
          { name: 'Run Diagnostics', value: 'runDiagnostics' },
          { name: 'Verify Device Authenticity', value: 'verifyAuthenticity' },
        ],
        default: 'getDeviceInfo',
      },

      // GRAPHENE operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['graphene'] } },
        options: [
          { name: 'Get Backup Checksum', value: 'getChecksum' },
          { name: 'Get GRAPHENE Info', value: 'getInfo' },
          { name: 'Get GRAPHENE Version', value: 'getVersion' },
          { name: 'Get Recovery Status', value: 'getRecoveryStatus' },
          { name: 'Validate GRAPHENE Plate', value: 'validatePlate' },
          { name: 'Verify GRAPHENE Backup', value: 'verifyBackup' },
        ],
        default: 'getInfo',
      },

      // Account operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['account'] } },
        options: [
          { name: 'Export Account QR', value: 'exportQr' },
          { name: 'Get Account Address', value: 'getAddress' },
          { name: 'Get Account By Chain', value: 'getByChain' },
          { name: 'Get Account Descriptor', value: 'getDescriptor' },
          { name: 'Get Accounts', value: 'getAccounts' },
          { name: 'Get Extended Public Key', value: 'getXpub' },
          { name: 'Get Multi-Chain Accounts', value: 'getMultiChain' },
          { name: 'Get Watch-Only Account', value: 'getWatchOnly' },
          { name: 'Sync with LIQUID', value: 'syncLiquid' },
        ],
        default: 'getAccounts',
      },

      // QR Code operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['qrCode'] } },
        options: [
          { name: 'Decode UR', value: 'decodeUr' },
          { name: 'Encode UR', value: 'encodeUr' },
          { name: 'Export QR Image', value: 'exportImage' },
          { name: 'Generate Animated QR', value: 'generateAnimated' },
          { name: 'Generate QR Code', value: 'generate' },
          { name: 'Get Animation Frames', value: 'getFrames' },
          { name: 'Merge QR Parts', value: 'mergeParts' },
          { name: 'Parse Animated QR', value: 'parseAnimated' },
          { name: 'Parse QR Code', value: 'parse' },
          { name: 'Split QR (Large Data)', value: 'split' },
          { name: 'Validate QR Format', value: 'validate' },
        ],
        default: 'generate',
      },

      // Bitcoin operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['bitcoin'] } },
        options: [
          { name: 'Broadcast Transaction', value: 'broadcast' },
          { name: 'Create PSBT', value: 'createPsbt' },
          { name: 'Export Watch-Only', value: 'exportWatchOnly' },
          { name: 'Generate Signature QR', value: 'generateSignatureQr' },
          { name: 'Get Bitcoin Address', value: 'getAddress' },
          { name: 'Get Bitcoin Addresses', value: 'getAddresses' },
          { name: 'Get UTXO', value: 'getUtxo' },
          { name: 'Get xPub/yPub/zPub', value: 'getExtendedPubkey' },
          { name: 'Import Signature QR', value: 'importSignatureQr' },
          { name: 'Sign Message', value: 'signMessage' },
          { name: 'Sign PSBT', value: 'signPsbt' },
          { name: 'Verify Message', value: 'verifyMessage' },
        ],
        default: 'getAddress',
      },

      // Ethereum operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['ethereum'] } },
        options: [
          { name: 'Broadcast Transaction', value: 'broadcast' },
          { name: 'Generate Signature QR', value: 'generateSignatureQr' },
          { name: 'Get Balance', value: 'getBalance' },
          { name: 'Get Ethereum Address', value: 'getAddress' },
          { name: 'Import Signature QR', value: 'importSignatureQr' },
          { name: 'Sign EIP-1559 Transaction', value: 'signEip1559' },
          { name: 'Sign Legacy Transaction', value: 'signLegacy' },
          { name: 'Sign Message', value: 'signMessage' },
          { name: 'Sign Personal Message', value: 'signPersonalMessage' },
          { name: 'Sign Transaction', value: 'signTransaction' },
          { name: 'Sign Typed Data (EIP-712)', value: 'signTypedData' },
        ],
        default: 'getAddress',
      },

      // EVM Chains operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['evmChains'] } },
        options: [
          { name: 'Broadcast', value: 'broadcast' },
          { name: 'Generate QR', value: 'generateQr' },
          { name: 'Get Address', value: 'getAddress' },
          { name: 'Import Signature', value: 'importSignature' },
          { name: 'Sign Message', value: 'signMessage' },
          { name: 'Sign Transaction', value: 'signTransaction' },
          { name: 'Sign Typed Data', value: 'signTypedData' },
        ],
        default: 'getAddress',
      },

      // Solana operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['solana'] } },
        options: [
          { name: 'Broadcast Transaction', value: 'broadcast' },
          { name: 'Generate Signature QR', value: 'generateSignatureQr' },
          { name: 'Get Solana Address', value: 'getAddress' },
          { name: 'Get Token Accounts', value: 'getTokenAccounts' },
          { name: 'Import Signature QR', value: 'importSignatureQr' },
          { name: 'Sign Message', value: 'signMessage' },
          { name: 'Sign Transaction', value: 'signTransaction' },
        ],
        default: 'getAddress',
      },

      // Cosmos operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['cosmos'] } },
        options: [
          { name: 'Broadcast Transaction', value: 'broadcast' },
          { name: 'Get Balance', value: 'getBalance' },
          { name: 'Get Cosmos Address', value: 'getAddress' },
          { name: 'Sign Transaction', value: 'signTransaction' },
        ],
        default: 'getAddress',
      },

      // XRP operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['xrp'] } },
        options: [
          { name: 'Broadcast Transaction', value: 'broadcast' },
          { name: 'Get Account Info', value: 'getAccountInfo' },
          { name: 'Get XRP Address', value: 'getAddress' },
          { name: 'Sign Transaction', value: 'signTransaction' },
        ],
        default: 'getAddress',
      },

      // Cardano operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['cardano'] } },
        options: [
          { name: 'Broadcast Transaction', value: 'broadcast' },
          { name: 'Get Cardano Address', value: 'getAddress' },
          { name: 'Get Staking Key', value: 'getStakingKey' },
          { name: 'Sign Transaction', value: 'signTransaction' },
        ],
        default: 'getAddress',
      },

      // Polkadot operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['polkadot'] } },
        options: [
          { name: 'Broadcast Transaction', value: 'broadcast' },
          { name: 'Get Balance', value: 'getBalance' },
          { name: 'Get Polkadot Address', value: 'getAddress' },
          { name: 'Sign Extrinsic', value: 'signExtrinsic' },
        ],
        default: 'getAddress',
      },

      // Multi-Chain operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['multiChain'] } },
        options: [
          { name: 'Get All Addresses', value: 'getAllAddresses' },
          { name: 'Get Chain Balances', value: 'getChainBalances' },
          { name: 'Get Portfolio Balance', value: 'getPortfolio' },
          { name: 'Get Supported Chains', value: 'getSupportedChains' },
          { name: 'Get Transaction History', value: 'getHistory' },
        ],
        default: 'getAllAddresses',
      },

      // Transaction operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['transaction'] } },
        options: [
          { name: 'Broadcast Transaction', value: 'broadcast' },
          { name: 'Create Unsigned Transaction', value: 'createUnsigned' },
          { name: 'Estimate Fee', value: 'estimateFee' },
          { name: 'Generate Transaction QR', value: 'generateQr' },
          { name: 'Get Transaction Status', value: 'getStatus' },
          { name: 'Import Signed Transaction', value: 'importSigned' },
          { name: 'Sign Transaction', value: 'sign' },
          { name: 'Verify Transaction', value: 'verify' },
        ],
        default: 'createUnsigned',
      },

      // PSBT operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['psbt'] } },
        options: [
          { name: 'Analyze PSBT', value: 'analyze' },
          { name: 'Create PSBT', value: 'create' },
          { name: 'Export Signed PSBT', value: 'export' },
          { name: 'Extract Transaction', value: 'extract' },
          { name: 'Finalize PSBT', value: 'finalize' },
          { name: 'Get PSBT Info', value: 'getInfo' },
          { name: 'Import PSBT (Base64)', value: 'importBase64' },
          { name: 'Import PSBT (QR)', value: 'importQr' },
          { name: 'Sign PSBT', value: 'sign' },
        ],
        default: 'create',
      },

      // Signing operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['signing'] } },
        options: [
          { name: 'Batch Sign', value: 'batchSign' },
          { name: 'Generate Signature QR', value: 'generateQr' },
          { name: 'Parse Signature QR', value: 'parseQr' },
          { name: 'Sign Hash', value: 'signHash' },
          { name: 'Sign Message', value: 'signMessage' },
          { name: 'Sign PSBT', value: 'signPsbt' },
          { name: 'Sign Transaction', value: 'signTransaction' },
          { name: 'Sign Typed Data', value: 'signTypedData' },
          { name: 'Verify Signature', value: 'verify' },
        ],
        default: 'signTransaction',
      },

      // Multi-Signature operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['multisig'] } },
        options: [
          { name: 'Add Co-Signer', value: 'addCosigner' },
          { name: 'Create Multisig Wallet', value: 'create' },
          { name: 'Export BSMS', value: 'exportBsms' },
          { name: 'Export Multisig Config', value: 'exportConfig' },
          { name: 'Get Co-Signers', value: 'getCosigners' },
          { name: 'Get Multisig Address', value: 'getAddress' },
          { name: 'Get Multisig Info', value: 'getInfo' },
          { name: 'Import Multisig Config', value: 'importConfig' },
          { name: 'Sign Multisig PSBT', value: 'signPsbt' },
        ],
        default: 'create',
      },

      // Watch-Only Export operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['watchOnly'] } },
        options: [
          { name: 'Export Generic JSON', value: 'exportJson' },
          { name: 'Export Output Descriptor', value: 'exportDescriptor' },
          { name: 'Export to Bitcoin Core', value: 'exportBitcoinCore' },
          { name: 'Export to BlueWallet', value: 'exportBlueWallet' },
          { name: 'Export to Electrum', value: 'exportElectrum' },
          { name: 'Export to LIQUID', value: 'exportLiquid' },
          { name: 'Export to Sparrow', value: 'exportSparrow' },
          { name: 'Get Export QR', value: 'getQr' },
        ],
        default: 'exportLiquid',
      },

      // LIQUID operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['liquid'] } },
        options: [
          { name: 'Connect to LIQUID', value: 'connect' },
          { name: 'Get LIQUID Portfolio', value: 'getPortfolio' },
          { name: 'Get LIQUID Settings', value: 'getSettings' },
          { name: 'Get LIQUID Transactions', value: 'getTransactions' },
          { name: 'Get LIQUID Version', value: 'getVersion' },
          { name: 'Import from LIQUID', value: 'import' },
          { name: 'Send to LIQUID', value: 'send' },
          { name: 'Sync with LIQUID', value: 'sync' },
        ],
        default: 'connect',
      },

      // Biometric operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['biometric'] } },
        options: [
          { name: 'Biometric Authentication', value: 'authenticate' },
          { name: 'Get Biometric Settings', value: 'getSettings' },
          { name: 'Get Biometric Status', value: 'getStatus' },
          { name: 'Get Enrolled Fingerprints', value: 'getEnrolled' },
          { name: 'Is Biometric Enabled', value: 'isEnabled' },
        ],
        default: 'getStatus',
      },

      // PIN operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['pin'] } },
        options: [
          { name: 'Change PIN', value: 'change' },
          { name: 'Get PIN Attempts', value: 'getAttempts' },
          { name: 'Get PIN Status', value: 'getStatus' },
          { name: 'Is PIN Required', value: 'isRequired' },
          { name: 'Reset PIN', value: 'reset' },
          { name: 'Set PIN', value: 'set' },
        ],
        default: 'getStatus',
      },

      // Backup operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['backup'] } },
        options: [
          { name: 'Export Backup Info', value: 'exportInfo' },
          { name: 'Get Backup Checksum', value: 'getChecksum' },
          { name: 'Get Backup Status', value: 'getStatus' },
          { name: 'Get Recovery Words Count', value: 'getWordCount' },
          { name: 'Verify GRAPHENE Backup', value: 'verifyGraphene' },
          { name: 'Verify Recovery Words', value: 'verifyWords' },
        ],
        default: 'getStatus',
      },

      // Security operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['security'] } },
        options: [
          { name: 'Factory Reset', value: 'factoryReset' },
          { name: 'Get EAL7 Certification', value: 'getEal7Cert' },
          { name: 'Get Entropy Quality', value: 'getEntropyQuality' },
          { name: 'Get Light Sensor Status', value: 'getLightSensor' },
          { name: 'Get Physical Security', value: 'getPhysicalSecurity' },
          { name: 'Get Security Level', value: 'getLevel' },
          { name: 'Get Tamper Status', value: 'getTamperStatus' },
          { name: 'Run Security Check', value: 'runCheck' },
          { name: 'Verify Device Authenticity', value: 'verifyAuthenticity' },
        ],
        default: 'getLevel',
      },

      // Firmware operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['firmware'] } },
        options: [
          { name: 'Check for Updates', value: 'checkUpdates' },
          { name: 'Get Bootloader Version', value: 'getBootloaderVersion' },
          { name: 'Get Changelog', value: 'getChangelog' },
          { name: 'Get Firmware Version', value: 'getVersion' },
          { name: 'Get Secure Element Version', value: 'getSeVersion' },
          { name: 'Verify Firmware Signature', value: 'verifySignature' },
        ],
        default: 'getVersion',
      },

      // Utility operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['utility'] } },
        options: [
          { name: 'Get Derivation Paths', value: 'getDerivationPaths' },
          { name: 'Get Device Health', value: 'getDeviceHealth' },
          { name: 'Get QR Settings', value: 'getQrSettings' },
          { name: 'Get Supported Chains', value: 'getSupportedChains' },
          { name: 'Set Animation Speed', value: 'setAnimationSpeed' },
          { name: 'Test Connection', value: 'testConnection' },
          { name: 'Validate Address', value: 'validateAddress' },
        ],
        default: 'getSupportedChains',
      },

      // Common parameters for chain operations
      {
        displayName: 'Chain',
        name: 'chain',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['evmChains'],
          },
        },
        options: [
          { name: 'Arbitrum', value: 'arbitrum' },
          { name: 'Avalanche C-Chain', value: 'avalanche' },
          { name: 'Base', value: 'base' },
          { name: 'BNB Chain', value: 'bnb' },
          { name: 'Cronos', value: 'cronos' },
          { name: 'Custom EVM', value: 'custom' },
          { name: 'Ethereum', value: 'ethereum' },
          { name: 'Fantom', value: 'fantom' },
          { name: 'Gnosis Chain', value: 'gnosis' },
          { name: 'Optimism', value: 'optimism' },
          { name: 'Polygon', value: 'polygon' },
        ],
        default: 'ethereum',
      },

      // Derivation path
      {
        displayName: 'Derivation Path',
        name: 'derivationPath',
        type: 'string',
        default: "m/44'/60'/0'/0/0",
        description: 'BIP44 derivation path for the account',
        displayOptions: {
          show: {
            resource: ['account', 'bitcoin', 'ethereum', 'evmChains', 'solana', 'cosmos', 'xrp', 'cardano', 'polkadot'],
            operation: ['getAddress', 'getAddresses', 'getExtendedPubkey', 'getByChain', 'getXpub'],
          },
        },
      },

      // Account index
      {
        displayName: 'Account Index',
        name: 'accountIndex',
        type: 'number',
        default: 0,
        description: 'Account index in derivation path',
        displayOptions: {
          show: {
            resource: ['account', 'bitcoin', 'ethereum', 'evmChains', 'solana'],
          },
        },
      },

      // Address type for Bitcoin
      {
        displayName: 'Address Type',
        name: 'addressType',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['bitcoin'],
            operation: ['getAddress', 'getAddresses', 'getExtendedPubkey'],
          },
        },
        options: [
          { name: 'Legacy (P2PKH)', value: 'legacy' },
          { name: 'SegWit (P2SH-P2WPKH)', value: 'segwit' },
          { name: 'Native SegWit (P2WPKH)', value: 'nativeSegwit' },
          { name: 'Taproot (P2TR)', value: 'taproot' },
        ],
        default: 'nativeSegwit',
      },

      // Network selection
      {
        displayName: 'Network',
        name: 'network',
        type: 'options',
        default: 'mainnet',
        options: [
          { name: 'Mainnet', value: 'mainnet' },
          { name: 'Testnet', value: 'testnet' },
        ],
        displayOptions: {
          show: {
            resource: ['bitcoin', 'ethereum', 'evmChains', 'solana', 'cosmos', 'xrp', 'cardano', 'polkadot'],
          },
        },
      },

      // QR Code data input
      {
        displayName: 'QR Data',
        name: 'qrData',
        type: 'string',
        default: '',
        description: 'Data to encode in QR code or UR string to decode',
        displayOptions: {
          show: {
            resource: ['qrCode'],
            operation: ['generate', 'generateAnimated', 'encodeUr', 'decodeUr', 'parse', 'validate'],
          },
        },
      },

      // QR format
      {
        displayName: 'QR Format',
        name: 'qrFormat',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['qrCode'],
            operation: ['generate', 'generateAnimated', 'exportImage'],
          },
        },
        options: [
          { name: 'Data URL', value: 'dataUrl' },
          { name: 'SVG', value: 'svg' },
          { name: 'PNG Buffer', value: 'buffer' },
        ],
        default: 'dataUrl',
      },

      // UR Type
      {
        displayName: 'UR Type',
        name: 'urType',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['qrCode'],
            operation: ['encodeUr'],
          },
        },
        options: [
          { name: 'Bytes', value: 'bytes' },
          { name: 'Crypto Account', value: 'crypto-account' },
          { name: 'Crypto HD Key', value: 'crypto-hdkey' },
          { name: 'Crypto PSBT', value: 'crypto-psbt' },
          { name: 'ETH Sign Request', value: 'eth-sign-request' },
          { name: 'ETH Signature', value: 'eth-signature' },
        ],
        default: 'bytes',
      },

      // PSBT Base64
      {
        displayName: 'PSBT (Base64)',
        name: 'psbtBase64',
        type: 'string',
        default: '',
        description: 'PSBT encoded as base64 string',
        displayOptions: {
          show: {
            resource: ['psbt', 'bitcoin'],
            operation: ['sign', 'signPsbt', 'analyze', 'getInfo', 'finalize', 'extract', 'export', 'importBase64'],
          },
        },
      },

      // Transaction data
      {
        displayName: 'Transaction Data',
        name: 'transactionData',
        type: 'json',
        default: '{}',
        description: 'Transaction data to sign',
        displayOptions: {
          show: {
            resource: ['ethereum', 'evmChains', 'transaction', 'signing'],
            operation: ['signTransaction', 'signEip1559', 'signLegacy', 'sign', 'createUnsigned'],
          },
        },
      },

      // Message to sign
      {
        displayName: 'Message',
        name: 'message',
        type: 'string',
        default: '',
        description: 'Message to sign or verify',
        displayOptions: {
          show: {
            operation: ['signMessage', 'signPersonalMessage', 'verifyMessage'],
          },
        },
      },

      // Typed data for EIP-712
      {
        displayName: 'Typed Data',
        name: 'typedData',
        type: 'json',
        default: '{}',
        description: 'EIP-712 typed data structure',
        displayOptions: {
          show: {
            operation: ['signTypedData'],
          },
        },
      },

      // Signature for verification
      {
        displayName: 'Signature',
        name: 'signature',
        type: 'string',
        default: '',
        description: 'Signature to verify or import',
        displayOptions: {
          show: {
            operation: ['verify', 'verifyMessage', 'importSignature', 'importSignatureQr', 'importSigned'],
          },
        },
      },

      // Multisig parameters
      {
        displayName: 'Required Signatures (M)',
        name: 'requiredSignatures',
        type: 'number',
        default: 2,
        description: 'Number of required signatures (M in M-of-N)',
        displayOptions: {
          show: {
            resource: ['multisig'],
            operation: ['create'],
          },
        },
      },

      {
        displayName: 'Total Signers (N)',
        name: 'totalSigners',
        type: 'number',
        default: 3,
        description: 'Total number of signers (N in M-of-N)',
        displayOptions: {
          show: {
            resource: ['multisig'],
            operation: ['create'],
          },
        },
      },

      // Watch-only export format
      {
        displayName: 'Export Format',
        name: 'exportFormat',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['watchOnly'],
          },
        },
        options: [
          { name: 'Bitcoin Core', value: 'bitcoinCore' },
          { name: 'BlueWallet', value: 'blueWallet' },
          { name: 'Electrum', value: 'electrum' },
          { name: 'Generic JSON', value: 'json' },
          { name: 'LIQUID', value: 'liquid' },
          { name: 'Output Descriptor', value: 'descriptor' },
          { name: 'Sparrow', value: 'sparrow' },
        ],
        default: 'liquid',
      },

      // Animation settings
      {
        displayName: 'Animation FPS',
        name: 'animationFps',
        type: 'number',
        default: 10,
        description: 'Frames per second for animated QR codes',
        displayOptions: {
          show: {
            resource: ['qrCode', 'utility'],
            operation: ['generateAnimated', 'setAnimationSpeed', 'getFrames'],
          },
        },
      },

      {
        displayName: 'Fragment Size',
        name: 'fragmentSize',
        type: 'number',
        default: 200,
        description: 'Maximum bytes per QR code fragment',
        displayOptions: {
          show: {
            resource: ['qrCode'],
            operation: ['generateAnimated', 'split'],
          },
        },
      },

      // LIQUID settings
      {
        displayName: 'Auto Sync',
        name: 'autoSync',
        type: 'boolean',
        default: true,
        description: 'Automatically sync with LIQUID app',
        displayOptions: {
          show: {
            resource: ['liquid'],
            operation: ['connect', 'getSettings'],
          },
        },
      },

      // Address for validation
      {
        displayName: 'Address',
        name: 'address',
        type: 'string',
        default: '',
        description: 'Blockchain address to validate or use',
        displayOptions: {
          show: {
            resource: ['utility', 'ethereum', 'bitcoin'],
            operation: ['validateAddress', 'getBalance', 'getUtxo', 'getAccountInfo'],
          },
        },
      },

      // GRAPHENE word count
      {
        displayName: 'Word Count',
        name: 'wordCount',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['graphene', 'backup'],
            operation: ['verifyBackup', 'verifyWords', 'validatePlate'],
          },
        },
        options: [
          { name: '12 Words', value: 12 },
          { name: '18 Words', value: 18 },
          { name: '24 Words', value: 24 },
        ],
        default: 24,
      },

      // Additional options
      {
        displayName: 'Additional Options',
        name: 'additionalOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        options: [
          {
            displayName: 'Include Metadata',
            name: 'includeMetadata',
            type: 'boolean',
            default: false,
            description: 'Include additional metadata in response',
          },
          {
            displayName: 'Verify on Device',
            name: 'verifyOnDevice',
            type: 'boolean',
            default: true,
            description: 'Require verification on NGRAVE ZERO screen',
          },
          {
            displayName: 'Timeout (Seconds)',
            name: 'timeout',
            type: 'number',
            default: 60,
            description: 'Operation timeout in seconds',
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let result: INodeExecutionData;

        switch (resource) {
          case 'device':
            result = await device.execute.call(this, operation, i);
            break;
          case 'graphene':
            result = await graphene.execute.call(this, operation, i);
            break;
          case 'account':
            result = await account.execute.call(this, operation, i);
            break;
          case 'qrCode':
            result = await qrCode.execute.call(this, operation, i);
            break;
          case 'bitcoin':
            result = await bitcoin.execute.call(this, operation, i);
            break;
          case 'ethereum':
            result = await ethereum.execute.call(this, operation, i);
            break;
          case 'evmChains':
            result = await evmChains.execute.call(this, operation, i);
            break;
          case 'solana':
            result = await solana.execute.call(this, operation, i);
            break;
          case 'cosmos':
            result = await cosmos.execute.call(this, operation, i);
            break;
          case 'xrp':
            result = await xrp.execute.call(this, operation, i);
            break;
          case 'cardano':
            result = await cardano.execute.call(this, operation, i);
            break;
          case 'polkadot':
            result = await polkadot.execute.call(this, operation, i);
            break;
          case 'multiChain':
            result = await multiChain.execute.call(this, operation, i);
            break;
          case 'transaction':
            result = await transaction.execute.call(this, operation, i);
            break;
          case 'psbt':
            result = await psbt.execute.call(this, operation, i);
            break;
          case 'signing':
            result = await signing.execute.call(this, operation, i);
            break;
          case 'multisig':
            result = await multisig.execute.call(this, operation, i);
            break;
          case 'watchOnly':
            result = await watchOnly.execute.call(this, operation, i);
            break;
          case 'liquid':
            result = await liquid.execute.call(this, operation, i);
            break;
          case 'biometric':
            result = await biometric.execute.call(this, operation, i);
            break;
          case 'pin':
            result = await pin.execute.call(this, operation, i);
            break;
          case 'backup':
            result = await backup.execute.call(this, operation, i);
            break;
          case 'security':
            result = await security.execute.call(this, operation, i);
            break;
          case 'firmware':
            result = await firmware.execute.call(this, operation, i);
            break;
          case 'utility':
            result = await utility.execute.call(this, operation, i);
            break;
          default:
            throw new Error(`Unknown resource: ${resource}`);
        }

        returnData.push(result);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: error instanceof Error ? error.message : 'Unknown error occurred',
            },
            pairedItem: { item: i },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
