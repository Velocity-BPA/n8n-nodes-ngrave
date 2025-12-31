/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Event Types for NGRAVE ZERO Trigger Node
 *
 * Defines all events that can be monitored by the trigger node.
 */

/**
 * QR Code related events
 */
export const QR_EVENTS = {
  QR_SCANNED: 'qr.scanned',
  ANIMATED_QR_COMPLETE: 'qr.animated.complete',
  SIGNATURE_READY: 'qr.signature.ready',
  QR_PARSE_ERROR: 'qr.parse.error',
  QR_GENERATED: 'qr.generated',
  QR_ANIMATION_STARTED: 'qr.animation.started',
} as const;

/**
 * Signing events
 */
export const SIGNING_EVENTS = {
  TRANSACTION_SIGNED: 'signing.transaction.signed',
  MESSAGE_SIGNED: 'signing.message.signed',
  PSBT_SIGNED: 'signing.psbt.signed',
  TYPED_DATA_SIGNED: 'signing.typed.data.signed',
  SIGNING_CANCELLED: 'signing.cancelled',
  SIGNING_FAILED: 'signing.failed',
  SIGNING_TIMEOUT: 'signing.timeout',
} as const;

/**
 * Transaction events
 */
export const TRANSACTION_EVENTS = {
  TRANSACTION_CREATED: 'transaction.created',
  TRANSACTION_BROADCAST: 'transaction.broadcast',
  TRANSACTION_CONFIRMED: 'transaction.confirmed',
  TRANSACTION_FAILED: 'transaction.failed',
  TRANSACTION_PENDING: 'transaction.pending',
  TRANSACTION_REPLACED: 'transaction.replaced',
} as const;

/**
 * Account events
 */
export const ACCOUNT_EVENTS = {
  ACCOUNT_EXPORTED: 'account.exported',
  WATCH_ONLY_CREATED: 'account.watch.only.created',
  ACCOUNT_SYNCED: 'account.synced',
  ACCOUNT_UPDATED: 'account.updated',
  ADDRESS_GENERATED: 'account.address.generated',
} as const;

/**
 * Device events
 */
export const DEVICE_EVENTS = {
  BIOMETRIC_AUTHENTICATED: 'device.biometric.authenticated',
  PIN_ENTERED: 'device.pin.entered',
  SECURITY_ALERT: 'device.security.alert',
  TAMPER_DETECTED: 'device.tamper.detected',
  LIGHT_SENSOR_TRIGGERED: 'device.light.sensor.triggered',
  DEVICE_LOCKED: 'device.locked',
  DEVICE_UNLOCKED: 'device.unlocked',
  BATTERY_LOW: 'device.battery.low',
  FIRMWARE_UPDATED: 'device.firmware.updated',
} as const;

/**
 * LIQUID app events
 */
export const LIQUID_EVENTS = {
  LIQUID_CONNECTED: 'liquid.connected',
  LIQUID_DISCONNECTED: 'liquid.disconnected',
  LIQUID_SYNCED: 'liquid.synced',
  TRANSACTION_RECEIVED: 'liquid.transaction.received',
  PORTFOLIO_UPDATED: 'liquid.portfolio.updated',
  LIQUID_ERROR: 'liquid.error',
} as const;

/**
 * GRAPHENE backup events
 */
export const GRAPHENE_EVENTS = {
  BACKUP_VERIFIED: 'graphene.backup.verified',
  BACKUP_FAILED: 'graphene.backup.failed',
  RECOVERY_STARTED: 'graphene.recovery.started',
  RECOVERY_COMPLETE: 'graphene.recovery.complete',
} as const;

/**
 * Multi-signature events
 */
export const MULTISIG_EVENTS = {
  MULTISIG_CREATED: 'multisig.created',
  COSIGNER_ADDED: 'multisig.cosigner.added',
  SIGNATURE_COLLECTED: 'multisig.signature.collected',
  THRESHOLD_MET: 'multisig.threshold.met',
} as const;

/**
 * All events combined
 */
export const ALL_EVENTS = {
  ...QR_EVENTS,
  ...SIGNING_EVENTS,
  ...TRANSACTION_EVENTS,
  ...ACCOUNT_EVENTS,
  ...DEVICE_EVENTS,
  ...LIQUID_EVENTS,
  ...GRAPHENE_EVENTS,
  ...MULTISIG_EVENTS,
} as const;

/**
 * NGRAVE Event Types - Flat constant for backward compatibility
 */
export const NGRAVE_EVENT_TYPES = {
  // QR Events
  QR_SCANNED: 'qr.scanned',
  QR_GENERATED: 'qr.generated',
  
  // Signing Events
  TRANSACTION_SIGNED: 'signing.transaction.signed',
  MESSAGE_SIGNED: 'signing.message.signed',
  PSBT_SIGNED: 'signing.psbt.signed',
  
  // Transaction Events
  TRANSACTION_CREATED: 'transaction.created',
  TRANSACTION_BROADCAST: 'transaction.broadcast',
  TRANSACTION_CONFIRMED: 'transaction.confirmed',
  
  // Account Events
  ACCOUNT_SYNCED: 'account.synced',
  ADDRESS_GENERATED: 'account.address.generated',
  
  // Device Events
  DEVICE_CONNECTED: 'device.connected',
  DEVICE_DISCONNECTED: 'device.disconnected',
  DEVICE_UNLOCKED: 'device.unlocked',
  DEVICE_LOCKED: 'device.locked',
  
  // LIQUID Events
  LIQUID_SYNCED: 'liquid.synced',
  PORTFOLIO_UPDATED: 'liquid.portfolio.updated',
  
  // GRAPHENE Events
  BACKUP_VERIFIED: 'graphene.backup.verified',
  
  // Multi-sig Events
  COSIGNER_ADDED: 'multisig.cosigner.added',
  THRESHOLD_MET: 'multisig.threshold.met',
} as const;

/**
 * Event type to category mapping
 */
export const EVENT_CATEGORIES = {
  qr: Object.values(QR_EVENTS),
  signing: Object.values(SIGNING_EVENTS),
  transaction: Object.values(TRANSACTION_EVENTS),
  account: Object.values(ACCOUNT_EVENTS),
  device: Object.values(DEVICE_EVENTS),
  liquid: Object.values(LIQUID_EVENTS),
  graphene: Object.values(GRAPHENE_EVENTS),
  multisig: Object.values(MULTISIG_EVENTS),
} as const;

/**
 * Event options for n8n UI
 */
export const EVENT_OPTIONS = [
  {
    name: 'QR Events',
    value: 'qr',
    description: 'QR code scanning and generation events',
  },
  {
    name: 'Signing Events',
    value: 'signing',
    description: 'Transaction and message signing events',
  },
  {
    name: 'Transaction Events',
    value: 'transaction',
    description: 'Transaction lifecycle events',
  },
  {
    name: 'Account Events',
    value: 'account',
    description: 'Account export and sync events',
  },
  {
    name: 'Device Events',
    value: 'device',
    description: 'Device security and status events',
  },
  {
    name: 'LIQUID Events',
    value: 'liquid',
    description: 'LIQUID app integration events',
  },
  {
    name: 'GRAPHENE Events',
    value: 'graphene',
    description: 'GRAPHENE backup events',
  },
  {
    name: 'Multi-Signature Events',
    value: 'multisig',
    description: 'Multi-signature wallet events',
  },
] as const;

/**
 * Get events by category
 */
export function getEventsByCategory(
  category: keyof typeof EVENT_CATEGORIES,
): readonly string[] {
  return EVENT_CATEGORIES[category];
}

/**
 * Check if an event belongs to a category
 */
export function isEventInCategory(
  event: string,
  category: keyof typeof EVENT_CATEGORIES,
): boolean {
  return EVENT_CATEGORIES[category].includes(event as never);
}

/**
 * Get the category of an event
 */
export function getEventCategory(event: string): string | undefined {
  for (const [category, events] of Object.entries(EVENT_CATEGORIES)) {
    if (events.includes(event as never)) {
      return category;
    }
  }
  return undefined;
}
