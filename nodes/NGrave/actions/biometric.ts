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
 * Biometric Resource Actions
 *
 * Operations for biometric authentication management.
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
          biometric: {
            isEnabled: true,
            isAvailable: true,
            type: 'fingerprint',
            enrolledCount: 2,
            maxEnrollments: NGRAVE_ZERO_FEATURES.MAX_FINGERPRINTS,
            lastAuthentication: new Date().toISOString(),
          },
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'isEnabled': {
      return {
        json: {
          isEnabled: true,
          type: 'fingerprint',
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'getEnrolledFingerprints': {
      const fingerprints = [
        { id: 1, name: 'Right Index', enrolledAt: '2024-01-15T10:00:00Z' },
        { id: 2, name: 'Left Index', enrolledAt: '2024-01-15T10:05:00Z' },
      ];

      return {
        json: {
          fingerprints,
          count: fingerprints.length,
          maxAllowed: NGRAVE_ZERO_FEATURES.MAX_FINGERPRINTS,
          slotsRemaining: NGRAVE_ZERO_FEATURES.MAX_FINGERPRINTS - fingerprints.length,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'authenticate': {
      // This would trigger device authentication in real implementation
      return {
        json: {
          authenticationRequired: true,
          method: 'fingerprint',
          instructions: 'Place your enrolled finger on the biometric sensor',
          timeout: 30,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'getSettings': {
      return {
        json: {
          settings: {
            enabled: true,
            requiredForSigning: true,
            requiredForUnlock: true,
            fallbackToPIN: true,
            maxAttempts: 5,
          },
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    default:
      throw new Error(`Unknown Biometric operation: ${operation}`);
  }
}
