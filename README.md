# n8n-nodes-ngrave

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for NGRAVE ZERO hardware wallet integration providing 25 resources and 150+ operations for air-gapped cryptocurrency signing, PSBT workflows, multi-chain support, and GRAPHENE backup verification.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![NGRAVE](https://img.shields.io/badge/NGRAVE-ZERO-black)
![EAL7](https://img.shields.io/badge/Security-EAL7-green)

## Features

- **Air-Gapped Security**: Complete QR code-based communication with NGRAVE ZERO hardware wallet
- **Multi-Chain Support**: Bitcoin, Ethereum, EVM chains (Polygon, BSC, Avalanche, etc.), Solana, Cosmos, XRP, Cardano, and Polkadot
- **PSBT Workflows**: Full support for Partially Signed Bitcoin Transactions with UR encoding
- **Multi-Signature**: Create and manage multi-sig wallets with BSMS format support
- **GRAPHENE Backup**: Verify and manage GRAPHENE stainless steel backup plates
- **LIQUID Integration**: Seamless connection with NGRAVE LIQUID mobile companion app
- **Watch-Only Export**: Export to Sparrow, BlueWallet, Electrum, Bitcoin Core, and more
- **EAL7 Security**: Full access to NGRAVE's EAL7-certified security features
- **Biometric & PIN**: Manage device authentication settings
- **Animated QR Codes**: Support for large data transfers via multi-frame QR sequences
- **UR Encoding**: Full Uniform Resources (UR) codec support for PSBT, signing requests, and more

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** > **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-ngrave`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-ngrave

# Restart n8n
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-ngrave.git
cd n8n-nodes-ngrave

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-ngrave

# Restart n8n
n8n start
```

## Credentials Setup

### NGRAVE ZERO Credentials

| Field | Description | Required |
|-------|-------------|----------|
| Device ID | Your NGRAVE ZERO device identifier | Yes |
| Master Fingerprint | Master key fingerprint for verification | Yes |
| QR Scan Mode | QR scanning method (camera/file upload) | Yes |
| Animation Speed | Animated QR playback speed (ms) | No |
| Connection Mode | Communication mode (qr/bluetooth) | Yes |
| Network | Bitcoin network (mainnet/testnet/regtest) | Yes |

### NGRAVE LIQUID Credentials

| Field | Description | Required |
|-------|-------------|----------|
| API Key | LIQUID app API key | Yes |
| App ID | LIQUID application identifier | Yes |
| Environment | Production or Sandbox | Yes |
| Device Pairing Code | Code from LIQUID app | No |

### NGRAVE Network Credentials

| Field | Description | Required |
|-------|-------------|----------|
| Bitcoin RPC URL | Bitcoin node RPC endpoint | No |
| Ethereum RPC URL | Ethereum node RPC endpoint | No |
| Custom RPC URLs | Additional chain RPC endpoints | No |

## Resources & Operations

### Device Management
- `getDeviceInfo` - Get device information and specs
- `getFirmwareVersion` - Get current firmware version
- `getDeviceId` - Get unique device identifier
- `getMasterFingerprint` - Get master key fingerprint
- `verifyAuthenticity` - Verify device authenticity
- `getSecurityStatus` - Get security status overview
- `getBatteryStatus` - Get battery level and status
- `getScreenStatus` - Get display status
- `checkTamperStatus` - Check for tampering
- `getBiometricStatus` - Get biometric sensor status
- `getLightSensorStatus` - Get ambient light sensor status
- `runDiagnostics` - Run device diagnostics

### GRAPHENE Backup
- `getInfo` - Get GRAPHENE backup information
- `verifyBackup` - Verify backup integrity
- `getRecoveryStatus` - Get recovery phrase status
- `getChecksum` - Calculate backup checksum
- `getVersion` - Get GRAPHENE version
- `validatePlate` - Validate plate configuration

### Account Management
- `getAccounts` - List all accounts
- `getByChain` - Get accounts by blockchain
- `getAddress` - Get account address
- `getXpub` - Get extended public key
- `exportQr` - Export account as QR code
- `getDescriptor` - Get output descriptor
- `syncLiquid` - Sync with LIQUID app
- `getMultiChain` - Get multi-chain account info
- `getWatchOnly` - Get watch-only export

### QR Code Operations
- `generate` - Generate QR code
- `generateAnimated` - Generate animated QR sequence
- `parse` - Parse QR code
- `parseAnimated` - Parse animated QR sequence
- `encodeUr` - Encode data as UR
- `decodeUr` - Decode UR data
- `split` - Split data into fragments
- `mergeParts` - Merge QR fragments
- `getFrames` - Get animation frames
- `exportImage` - Export QR as image
- `validate` - Validate QR data

### Bitcoin Operations
- `getAddress` - Get Bitcoin address (legacy/segwit/native/taproot)
- `getAddresses` - Get multiple addresses
- `getExtendedPubkey` - Get xpub/ypub/zpub
- `createPsbt` - Create PSBT
- `signPsbt` - Sign PSBT on device
- `generateSignatureQr` - Generate signature request QR
- `importSignatureQr` - Import signed response
- `signMessage` - Sign message
- `verifyMessage` - Verify signed message
- `getUtxo` - Get UTXOs
- `broadcast` - Broadcast transaction
- `exportWatchOnly` - Export watch-only wallet

### Ethereum Operations
- `getAddress` - Get Ethereum address
- `signTransaction` - Sign transaction
- `signTypedData` - Sign EIP-712 typed data
- `signMessage` - Sign personal message
- `signEip1559Transaction` - Sign EIP-1559 transaction
- `generateSignatureQr` - Generate signature QR
- `importSignatureQr` - Import signature
- `broadcast` - Broadcast transaction
- `getBalance` - Get ETH balance
- `getAccountInfo` - Get account details

### EVM Chains Operations
Supports: Polygon, BSC, Avalanche, Arbitrum, Optimism, Fantom, Cronos, Gnosis, Base
- `getAddress` - Get address for chain
- `signTransaction` - Sign transaction
- `signMessage` - Sign message
- `signTypedData` - Sign typed data
- `generateSignatureQr` - Generate signature QR
- `importSignature` - Import signature
- `broadcast` - Broadcast transaction
- `getSupportedChains` - List supported EVM chains

### Solana Operations
- `getAddress` - Get Solana address
- `signTransaction` - Sign transaction
- `signMessage` - Sign message
- `generateSignatureQr` - Generate signature QR
- `importSignature` - Import signature
- `broadcast` - Broadcast transaction
- `getBalance` - Get SOL balance

### Cosmos Operations
- `getAddress` - Get Cosmos address
- `signTransaction` - Sign transaction
- `signMessage` - Sign message
- `broadcast` - Broadcast transaction

### XRP Operations
- `getAddress` - Get XRP address
- `signTransaction` - Sign transaction
- `signMessage` - Sign message
- `broadcast` - Broadcast transaction

### Cardano Operations
- `getAddress` - Get Cardano address
- `signTransaction` - Sign transaction
- `signMessage` - Sign message
- `broadcast` - Broadcast transaction

### Polkadot Operations
- `getAddress` - Get Polkadot address
- `signTransaction` - Sign transaction
- `signMessage` - Sign message
- `broadcast` - Broadcast transaction

### Multi-Chain Operations
- `getAllAddresses` - Get addresses for all chains
- `getPortfolio` - Get portfolio overview
- `getChainBalances` - Get balances per chain
- `getTransactionHistory` - Get cross-chain history
- `getSupportedChains` - List all supported chains

### Transaction Operations
- `createUnsigned` - Create unsigned transaction
- `generateQr` - Generate transaction QR
- `sign` - Sign transaction
- `importSigned` - Import signed transaction
- `broadcast` - Broadcast transaction
- `getStatus` - Get transaction status
- `estimateFee` - Estimate transaction fee
- `verify` - Verify transaction

### PSBT Operations
- `create` - Create new PSBT
- `importFromQr` - Import PSBT from QR
- `importFromBase64` - Import from base64
- `sign` - Sign PSBT
- `exportAsQr` - Export as QR code
- `analyze` - Analyze PSBT contents
- `getInfo` - Get PSBT information
- `finalize` - Finalize PSBT
- `extract` - Extract raw transaction

### Signing Operations
- `signTransaction` - Generic transaction signing
- `signMessage` - Generic message signing
- `signTypedData` - Sign typed data
- `signHash` - Sign raw hash
- `signPsbt` - Sign PSBT
- `generateSignatureQr` - Generate signature QR
- `parseSignatureQr` - Parse signature response
- `verify` - Verify signature
- `batchSign` - Batch sign multiple items

### Multi-Signature Operations
- `createWallet` - Create multi-sig wallet
- `importConfig` - Import multi-sig config
- `exportConfig` - Export config
- `getInfo` - Get wallet info
- `addCosigner` - Add cosigner
- `getCosigners` - List cosigners
- `signPsbt` - Sign as cosigner
- `getAddress` - Get multi-sig address
- `exportBsms` - Export BSMS format

### Watch-Only Operations
- `exportLiquid` - Export for LIQUID
- `exportSparrow` - Export for Sparrow wallet
- `exportBlueWallet` - Export for BlueWallet
- `exportElectrum` - Export for Electrum
- `exportBitcoinCore` - Export for Bitcoin Core
- `exportJson` - Export as JSON
- `exportDescriptor` - Export output descriptor
- `getQr` - Get export QR code

### LIQUID Operations
- `connect` - Connect to LIQUID app
- `sync` - Sync accounts
- `getPortfolio` - Get portfolio
- `getTransactions` - Get transactions
- `importAccount` - Import account
- `sendTransaction` - Send transaction
- `getSettings` - Get app settings
- `getVersion` - Get app version

### Biometric Operations
- `getStatus` - Get biometric status
- `isEnabled` - Check if enabled
- `getEnrolledFingerprints` - List fingerprints
- `authenticate` - Trigger authentication
- `getSettings` - Get biometric settings

### PIN Operations
- `getStatus` - Get PIN status
- `change` - Change PIN
- `set` - Set new PIN
- `reset` - Reset PIN
- `getAttempts` - Get remaining attempts
- `isRequired` - Check if PIN required

### Backup Operations
- `getStatus` - Get backup status
- `verifyGraphene` - Verify GRAPHENE
- `getWordCount` - Get word count
- `verifyWords` - Verify recovery words
- `getChecksum` - Get backup checksum
- `exportInfo` - Export backup info

### Security Operations
- `getSecurityLevel` - Get security level
- `verifyAuthenticity` - Verify device
- `getTamperStatus` - Check tampering
- `getLightSensorStatus` - Get light sensor
- `getPhysicalSecurity` - Physical security status
- `runSecurityCheck` - Run security audit
- `getEal7Certification` - Get EAL7 info
- `getEntropyQuality` - Get entropy quality
- `factoryReset` - Factory reset device

### Firmware Operations
- `getVersion` - Get firmware version
- `checkUpdates` - Check for updates
- `getChangelog` - Get version changelog
- `verifySignature` - Verify firmware signature
- `getBootloaderVersion` - Get bootloader version
- `getSecureElementVersion` - Get SE version

### Utility Operations
- `getSupportedChains` - List all chains
- `getDerivationPaths` - Get derivation paths
- `validateAddress` - Validate address format
- `getQrSettings` - Get QR settings
- `getAnimationSpeed` - Get animation speed
- `testConnection` - Test device connection
- `getDeviceHealth` - Get health status

## Trigger Node

The NGRAVE Trigger node monitors for events:

### Trigger Types
- **QR Scan Events**: New QR code scanned
- **Signing Events**: Transaction signed, PSBT signed, message signed
- **Transaction Events**: Transaction created, broadcast, confirmed
- **Account Events**: Account added, removed, synced
- **Device Events**: Connected, disconnected, unlocked
- **LIQUID Events**: Sync complete, portfolio updated
- **GRAPHENE Events**: Backup verified, checksum validated
- **Multi-Sig Events**: Cosigner added, threshold reached

## Usage Examples

### Sign Bitcoin Transaction

```javascript
// Create and sign a Bitcoin PSBT
const workflow = {
  nodes: [
    {
      name: 'Create PSBT',
      type: 'n8n-nodes-ngrave.nGrave',
      parameters: {
        resource: 'psbt',
        operation: 'create',
        inputs: [{ txid: '...', vout: 0, value: 100000 }],
        outputs: [{ address: 'bc1q...', value: 50000 }]
      }
    },
    {
      name: 'Sign on Device',
      type: 'n8n-nodes-ngrave.nGrave',
      parameters: {
        resource: 'psbt',
        operation: 'sign',
        psbtBase64: '={{$node["Create PSBT"].json.psbt}}'
      }
    }
  ]
};
```

### Multi-Chain Portfolio

```javascript
// Get portfolio across all chains
const workflow = {
  nodes: [
    {
      name: 'Get Portfolio',
      type: 'n8n-nodes-ngrave.nGrave',
      parameters: {
        resource: 'multiChain',
        operation: 'getPortfolio'
      }
    }
  ]
};
```

### Export Watch-Only Wallet

```javascript
// Export for Sparrow wallet
const workflow = {
  nodes: [
    {
      name: 'Export to Sparrow',
      type: 'n8n-nodes-ngrave.nGrave',
      parameters: {
        resource: 'watchOnly',
        operation: 'exportSparrow',
        accountIndex: 0,
        addressType: 'native_segwit'
      }
    }
  ]
};
```

## NGRAVE Concepts

### Air-Gapped Security
NGRAVE ZERO never connects to the internet or any network. All communication happens via QR codes, ensuring complete isolation from online threats.

### GRAPHENE Backup
GRAPHENE is NGRAVE's stainless steel backup solution:
- Fire resistant up to 1400°C (2500°F)
- Waterproof and corrosion resistant
- 100+ year lifespan
- Supports 12, 18, or 24 word recovery phrases

### EAL7 Certification
NGRAVE ZERO is the world's first EAL7-certified hardware wallet, the highest security certification available for consumer electronics.

### Uniform Resources (UR)
UR is a standard for encoding structured binary data in QR codes, enabling efficient transfer of PSBTs, signing requests, and other crypto data.

## Networks

| Network | Chain ID | Address Format |
|---------|----------|----------------|
| Bitcoin Mainnet | - | 1..., 3..., bc1q..., bc1p... |
| Bitcoin Testnet | - | m..., n..., 2..., tb1... |
| Ethereum | 1 | 0x... |
| Polygon | 137 | 0x... |
| BSC | 56 | 0x... |
| Avalanche | 43114 | 0x... |
| Arbitrum | 42161 | 0x... |
| Optimism | 10 | 0x... |
| Solana | - | Base58 |
| Cosmos | - | cosmos1... |
| XRP | - | r... |
| Cardano | - | addr1... |
| Polkadot | - | 1... |

## Error Handling

The node includes comprehensive error handling:

```javascript
{
  success: false,
  error: {
    code: 'DEVICE_NOT_CONNECTED',
    message: 'NGRAVE ZERO device not detected',
    suggestion: 'Ensure device is powered on and QR code is visible'
  }
}
```

### Common Error Codes
- `DEVICE_NOT_CONNECTED` - Device not detected
- `QR_PARSE_ERROR` - Failed to parse QR code
- `INVALID_PSBT` - Invalid PSBT format
- `SIGNING_REJECTED` - User rejected signing
- `INVALID_ADDRESS` - Invalid address format
- `NETWORK_MISMATCH` - Network configuration mismatch

## Security Best Practices

1. **Never expose seed phrases** - NGRAVE ZERO keeps keys secure
2. **Verify addresses** - Always verify on device screen
3. **Use multi-sig** - For high-value accounts
4. **Regular backups** - Verify GRAPHENE periodically
5. **Keep firmware updated** - Check for security updates
6. **Secure environment** - Use in private, secure location

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Format code
npm run format
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Support

- **Documentation**: [GitHub Wiki](https://github.com/Velocity-BPA/n8n-nodes-ngrave/wiki)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-ngrave/issues)
- **NGRAVE Support**: [ngrave.io](https://ngrave.io)

## Acknowledgments

- [NGRAVE](https://ngrave.io) - Hardware wallet manufacturer
- [n8n](https://n8n.io) - Workflow automation platform
- [bc-ur](https://github.com/BlockchainCommons/bc-ur) - Uniform Resources library
