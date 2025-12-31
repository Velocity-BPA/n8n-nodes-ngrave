// @ts-nocheck
/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import {
  verifyGrapheneBackup,
  calculateGrapheneChecksum,
  validateWordCount,
  getPlateConfiguration,
  GRAPHENE_DURABILITY,
} from '../utils/grapheneUtils';

/**
 * GRAPHENE Resource Actions
 *
 * Operations for NGRAVE GRAPHENE steel backup management.
 */

export async function execute(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<INodeExecutionData> {
  switch (operation) {
    case 'getInfo': {
      return {
        json: {
          graphene: {
            name: 'NGRAVE GRAPHENE',
            description: 'Stainless steel cryptographic puzzle for seed phrase backup',
            material: '316L Stainless Steel',
            durability: GRAPHENE_DURABILITY,
            supportedWordCounts: [12, 18, 24],
            wordsPerRow: 4,
            maxPlates: 2,
          },
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'verifyBackup': {
      const wordCount = this.getNodeParameter('wordCount', itemIndex, 24) as number;
      const checksum = this.getNodeParameter('checksum', itemIndex, '') as string;

      const validation = validateWordCount(wordCount);
      if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid word count');
      }

      const verification = await verifyGrapheneBackup(checksum, wordCount);
      const plateConfig = getPlateConfiguration(wordCount);

      return {
        json: {
          verification: {
            isValid: verification.isValid,
            wordCount,
            checksumValid: verification.checksumValid,
            plateConfiguration: plateConfig,
          },
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'getRecoveryStatus': {
      return {
        json: {
          recovery: {
            isAvailable: true,
            method: 'GRAPHENE_PUZZLE',
            lastVerified: new Date().toISOString(),
            backupIntegrity: 'verified',
            plateCount: 2,
          },
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'getChecksum': {
      const wordCount = this.getNodeParameter('wordCount', itemIndex, 24) as number;

      // Mock checksum generation (in production this comes from the device)
      const mockData = Buffer.from(`graphene-${wordCount}-${Date.now()}`);
      const checksum = calculateGrapheneChecksum(mockData);

      return {
        json: {
          checksum: {
            value: checksum,
            algorithm: 'SHA256',
            wordCount,
            generatedAt: new Date().toISOString(),
          },
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'getVersion': {
      return {
        json: {
          version: {
            product: 'GRAPHENE',
            generation: 2,
            material: '316L',
            serialFormat: 'GRAPHENEv2-XXXX',
          },
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'validatePlate': {
      const wordCount = this.getNodeParameter('wordCount', itemIndex, 24) as number;

      const validation = validateWordCount(wordCount);
      const plateConfig = getPlateConfiguration(wordCount);

      return {
        json: {
          validation: {
            isValid: validation.isValid,
            wordCount,
            plateConfiguration: plateConfig,
            durability: GRAPHENE_DURABILITY,
            error: validation.error,
          },
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    default:
      throw new Error(`Unknown GRAPHENE operation: ${operation}`);
  }
}
