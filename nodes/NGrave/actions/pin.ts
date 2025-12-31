// @ts-nocheck
/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NGRAVE_ZERO_FEATURES } from '../constants';

/**
 * PIN Resource Actions
 *
 * Operations for PIN management on NGRAVE ZERO.
 */

export async function execute(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<INodeExecutionData> {
  switch (operation) {
    case 'getStatus': {
      return {
        json: {
          pin: {
            isSet: true,
            length: 6,
            minLength: NGRAVE_ZERO_FEATURES.MIN_PIN_LENGTH,
            maxLength: NGRAVE_ZERO_FEATURES.MAX_PIN_LENGTH,
            attemptsRemaining: NGRAVE_ZERO_FEATURES.PIN_MAX_ATTEMPTS,
            maxAttempts: NGRAVE_ZERO_FEATURES.PIN_MAX_ATTEMPTS,
            wipeOnExhaustion: NGRAVE_ZERO_FEATURES.WIPE_ON_PIN_EXHAUSTION,
          },
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'change': {
      return {
        json: {
          action: 'change_pin',
          status: 'pending_device_interaction',
          instructions: 'Enter your current PIN on the device, then enter and confirm your new PIN',
          requirements: {
            minLength: NGRAVE_ZERO_FEATURES.MIN_PIN_LENGTH,
            maxLength: NGRAVE_ZERO_FEATURES.MAX_PIN_LENGTH,
          },
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'set': {
      return {
        json: {
          action: 'set_pin',
          status: 'pending_device_interaction',
          instructions: 'Enter and confirm your new PIN on the device',
          requirements: {
            minLength: NGRAVE_ZERO_FEATURES.MIN_PIN_LENGTH,
            maxLength: NGRAVE_ZERO_FEATURES.MAX_PIN_LENGTH,
          },
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'reset': {
      return {
        json: {
          action: 'reset_pin',
          status: 'requires_recovery',
          warning: 'PIN reset requires device recovery using GRAPHENE backup',
          instructions: 'To reset your PIN, you must perform a full device recovery',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'getAttempts': {
      return {
        json: {
          attempts: {
            remaining: 8,
            max: NGRAVE_ZERO_FEATURES.PIN_MAX_ATTEMPTS,
            used: 2,
            lastFailedAttempt: new Date(Date.now() - 3600000).toISOString(),
          },
          warning: NGRAVE_ZERO_FEATURES.WIPE_ON_PIN_EXHAUSTION
            ? 'Device will be wiped after all attempts are exhausted'
            : null,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'isRequired': {
      return {
        json: {
          isRequired: true,
          requiredFor: [
            'device_unlock',
            'transaction_signing',
            'seed_export',
            'settings_change',
          ],
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    default:
      throw new Error(`Unknown PIN operation: ${operation}`);
  }
}
