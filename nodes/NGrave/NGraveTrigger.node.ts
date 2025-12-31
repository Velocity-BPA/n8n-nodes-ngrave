/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	INodeType,
	INodeTypeDescription,
	ITriggerFunctions,
	ITriggerResponse,
} from 'n8n-workflow';

import { logLicensingNotice } from './constants';

// Log licensing notice once on module load
logLicensingNotice();

export class NGraveTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'NGRAVE ZERO Trigger',
		name: 'nGraveTrigger',
		icon: 'file:ngrave.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Triggers workflow on NGRAVE ZERO events',
		defaults: {
			name: 'NGRAVE ZERO Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'nGraveLiquid',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Event Category',
				name: 'eventCategory',
				type: 'options',
				default: 'qr',
				options: [
					{ name: 'QR Code Events', value: 'qr' },
					{ name: 'Signing Events', value: 'signing' },
					{ name: 'Transaction Events', value: 'transaction' },
					{ name: 'Account Events', value: 'account' },
					{ name: 'Device Events', value: 'device' },
					{ name: 'LIQUID Events', value: 'liquid' },
					{ name: 'GRAPHENE Events', value: 'graphene' },
					{ name: 'Multi-Sig Events', value: 'multisig' },
				],
				description: 'Category of events to monitor',
			},
			// QR Events
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['qr'],
					},
				},
				default: 'qr_scanned',
				options: [
					{ name: 'QR Scanned', value: 'qr_scanned' },
					{ name: 'QR Generated', value: 'qr_generated' },
					{ name: 'Animated QR Complete', value: 'animated_qr_complete' },
					{ name: 'UR Decoded', value: 'ur_decoded' },
				],
				description: 'QR code event to listen for',
			},
			// Signing Events
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['signing'],
					},
				},
				default: 'signature_created',
				options: [
					{ name: 'Signature Created', value: 'signature_created' },
					{ name: 'Signature Verified', value: 'signature_verified' },
					{ name: 'Signature Failed', value: 'signature_failed' },
					{ name: 'Message Signed', value: 'message_signed' },
					{ name: 'PSBT Signed', value: 'psbt_signed' },
				],
				description: 'Signing event to listen for',
			},
			// Transaction Events
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['transaction'],
					},
				},
				default: 'transaction_created',
				options: [
					{ name: 'Transaction Created', value: 'transaction_created' },
					{ name: 'Transaction Signed', value: 'transaction_signed' },
					{ name: 'Transaction Broadcast', value: 'transaction_broadcast' },
					{ name: 'Transaction Confirmed', value: 'transaction_confirmed' },
					{ name: 'Transaction Failed', value: 'transaction_failed' },
				],
				description: 'Transaction event to listen for',
			},
			// Account Events
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['account'],
					},
				},
				default: 'account_created',
				options: [
					{ name: 'Account Created', value: 'account_created' },
					{ name: 'Account Imported', value: 'account_imported' },
					{ name: 'Address Generated', value: 'address_generated' },
					{ name: 'Balance Changed', value: 'balance_changed' },
				],
				description: 'Account event to listen for',
			},
			// Device Events
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['device'],
					},
				},
				default: 'device_connected',
				options: [
					{ name: 'Device Connected', value: 'device_connected' },
					{ name: 'Device Disconnected', value: 'device_disconnected' },
					{ name: 'Firmware Updated', value: 'firmware_updated' },
					{ name: 'Battery Low', value: 'battery_low' },
					{ name: 'Tamper Detected', value: 'tamper_detected' },
					{ name: 'Security Alert', value: 'security_alert' },
				],
				description: 'Device event to listen for',
			},
			// LIQUID Events
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['liquid'],
					},
				},
				default: 'liquid_synced',
				options: [
					{ name: 'LIQUID Synced', value: 'liquid_synced' },
					{ name: 'LIQUID Connected', value: 'liquid_connected' },
					{ name: 'LIQUID Disconnected', value: 'liquid_disconnected' },
					{ name: 'Portfolio Updated', value: 'portfolio_updated' },
				],
				description: 'LIQUID app event to listen for',
			},
			// GRAPHENE Events
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['graphene'],
					},
				},
				default: 'backup_verified',
				options: [
					{ name: 'Backup Verified', value: 'backup_verified' },
					{ name: 'Backup Created', value: 'backup_created' },
					{ name: 'Recovery Initiated', value: 'recovery_initiated' },
					{ name: 'Recovery Complete', value: 'recovery_complete' },
				],
				description: 'GRAPHENE backup event to listen for',
			},
			// Multi-Sig Events
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['multisig'],
					},
				},
				default: 'cosigner_added',
				options: [
					{ name: 'Cosigner Added', value: 'cosigner_added' },
					{ name: 'Threshold Met', value: 'threshold_met' },
					{ name: 'Multisig Created', value: 'multisig_created' },
					{ name: 'Partial Signature', value: 'partial_signature' },
				],
				description: 'Multi-signature event to listen for',
			},
			// Filters
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				options: [
					{
						displayName: 'Chain',
						name: 'chain',
						type: 'options',
						default: 'all',
						options: [
							{ name: 'All Chains', value: 'all' },
							{ name: 'Bitcoin', value: 'bitcoin' },
							{ name: 'Ethereum', value: 'ethereum' },
							{ name: 'Polygon', value: 'polygon' },
							{ name: 'Solana', value: 'solana' },
							{ name: 'Cosmos', value: 'cosmos' },
							{ name: 'XRP', value: 'xrp' },
							{ name: 'Cardano', value: 'cardano' },
							{ name: 'Polkadot', value: 'polkadot' },
						],
						description: 'Filter by blockchain',
					},
					{
						displayName: 'Account',
						name: 'account',
						type: 'string',
						default: '',
						description: 'Filter by account address or name',
					},
					{
						displayName: 'Minimum Amount',
						name: 'minAmount',
						type: 'number',
						default: 0,
						description: 'Minimum transaction amount to trigger',
					},
					{
						displayName: 'Device ID',
						name: 'deviceId',
						type: 'string',
						default: '',
						description: 'Filter by specific device ID',
					},
				],
			},
			// Options
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Poll Interval',
						name: 'pollInterval',
						type: 'number',
						default: 60,
						description: 'How often to check for events (in seconds)',
					},
					{
						displayName: 'Include Raw Data',
						name: 'includeRaw',
						type: 'boolean',
						default: false,
						description: 'Whether to include raw event data in output',
					},
					{
						displayName: 'Batch Events',
						name: 'batchEvents',
						type: 'boolean',
						default: false,
						description: 'Whether to batch multiple events into single execution',
					},
				],
			},
		],
	};

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		const eventCategory = this.getNodeParameter('eventCategory') as string;
		const event = this.getNodeParameter('event') as string;
		const filters = this.getNodeParameter('filters', {}) as Record<string, unknown>;
		const options = this.getNodeParameter('options', {}) as Record<string, unknown>;

		const pollInterval = (options.pollInterval as number) || 60;
		const includeRaw = (options.includeRaw as boolean) || false;
		const batchEvents = (options.batchEvents as boolean) || false;

		let lastEventTime = new Date().toISOString();

		const poll = async () => {
			// Simulate event polling from LIQUID app
			// In production, this would connect to NGRAVE LIQUID API
			const events = await simulateEventPoll(
				eventCategory,
				event,
				filters,
				lastEventTime,
			);

			if (events.length > 0) {
				lastEventTime = new Date().toISOString();

				if (batchEvents) {
					// Return all events as single execution
					this.emit([
						events.map((e) => ({
							json: {
								...e,
								...(includeRaw ? { raw: e } : {}),
							},
						})),
					]);
				} else {
					// Return each event separately
					for (const evt of events) {
						this.emit([
							[
								{
									json: {
										...evt,
										...(includeRaw ? { raw: evt } : {}),
									},
								},
							],
						]);
					}
				}
			}
		};

		// Set up polling interval
		const intervalId = setInterval(poll, pollInterval * 1000);

		// Initial poll
		await poll();

		// Cleanup function
		const closeFunction = async () => {
			clearInterval(intervalId);
		};

		return {
			closeFunction,
		};
	}
}

/**
 * Simulate event polling from NGRAVE LIQUID
 * In production, this would connect to actual NGRAVE services
 */
async function simulateEventPoll(
	_category: string,
	_event: string,
	_filters: Record<string, unknown>,
	_lastEventTime: string,
): Promise<Record<string, unknown>[]> {
	// This is a simulation - in production, connect to NGRAVE LIQUID API
	// For now, return empty array to avoid generating fake events
	// Real implementation would query LIQUID app for new events

	const events: Record<string, unknown>[] = [];

	// Example event structure (commented out to avoid false triggers)
	/*
	events.push({
		id: `evt_${Date.now()}`,
		category,
		event,
		timestamp: new Date().toISOString(),
		data: getEventData(category, event),
		filters,
	});
	*/

	return events;
}

/**
 * Get sample event data based on category and event type
 */
function _getEventData(
	category: string,
	event: string,
): Record<string, unknown> {
	const eventDataMap: Record<string, Record<string, Record<string, unknown>>> = {
		qr: {
			qr_scanned: {
				qrType: 'ur',
				urType: 'crypto-psbt',
				size: 256,
				fragments: 1,
			},
			qr_generated: {
				format: 'dataURL',
				size: 256,
				errorCorrection: 'M',
			},
			animated_qr_complete: {
				totalFragments: 10,
				duration: 2500,
			},
			ur_decoded: {
				type: 'crypto-psbt',
				valid: true,
			},
		},
		signing: {
			signature_created: {
				signatureType: 'transaction',
				chain: 'bitcoin',
				algorithm: 'ecdsa',
			},
			signature_verified: {
				valid: true,
				signer: 'NGRAVE ZERO',
			},
			signature_failed: {
				reason: 'user_cancelled',
			},
			message_signed: {
				messageType: 'personal',
				encoding: 'utf8',
			},
			psbt_signed: {
				inputs: 2,
				outputs: 2,
			},
		},
		transaction: {
			transaction_created: {
				chain: 'bitcoin',
				type: 'transfer',
			},
			transaction_signed: {
				chain: 'bitcoin',
				signedBy: 'NGRAVE ZERO',
			},
			transaction_broadcast: {
				chain: 'bitcoin',
				network: 'mainnet',
			},
			transaction_confirmed: {
				chain: 'bitcoin',
				confirmations: 6,
			},
			transaction_failed: {
				reason: 'insufficient_funds',
			},
		},
		account: {
			account_created: {
				chain: 'bitcoin',
				type: 'native_segwit',
			},
			account_imported: {
				format: 'xpub',
				chain: 'bitcoin',
			},
			address_generated: {
				chain: 'bitcoin',
				type: 'receive',
				index: 0,
			},
			balance_changed: {
				chain: 'bitcoin',
				previousBalance: '0.5',
				newBalance: '0.75',
			},
		},
		device: {
			device_connected: {
				deviceId: 'ngrave_zero_001',
				firmwareVersion: '1.2.0',
			},
			device_disconnected: {
				deviceId: 'ngrave_zero_001',
				reason: 'timeout',
			},
			firmware_updated: {
				previousVersion: '1.1.0',
				newVersion: '1.2.0',
			},
			battery_low: {
				level: 15,
				estimatedMinutes: 30,
			},
			tamper_detected: {
				type: 'light_sensor',
				severity: 'warning',
			},
			security_alert: {
				type: 'multiple_pin_failures',
				attempts: 3,
			},
		},
		liquid: {
			liquid_synced: {
				accounts: 5,
				lastSync: new Date().toISOString(),
			},
			liquid_connected: {
				version: '2.1.0',
				platform: 'ios',
			},
			liquid_disconnected: {
				reason: 'user_action',
			},
			portfolio_updated: {
				totalValue: '50000.00',
				currency: 'USD',
			},
		},
		graphene: {
			backup_verified: {
				wordCount: 24,
				checksumValid: true,
			},
			backup_created: {
				wordCount: 24,
				timestamp: new Date().toISOString(),
			},
			recovery_initiated: {
				method: 'graphene',
				wordCount: 24,
			},
			recovery_complete: {
				success: true,
				accountsRecovered: 5,
			},
		},
		multisig: {
			cosigner_added: {
				totalCosigners: 2,
				threshold: 2,
			},
			threshold_met: {
				signatures: 2,
				required: 2,
			},
			multisig_created: {
				type: '2-of-3',
				scriptType: 'p2wsh',
			},
			partial_signature: {
				signaturesCollected: 1,
				signaturesRequired: 2,
			},
		},
	};

	return eventDataMap[category]?.[event] || {};
}
