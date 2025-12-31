// @ts-nocheck
/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import {
  generateQRCode,
  generateQRCodeSVG,
  generateAnimatedQRFrames,
  splitDataForAnimation,
  mergeQRFragments,
  validateQRFormat,
  estimateAnimationFrames,
} from '../utils/qrUtils';
import { encodeUR, decodeUR, validateUR } from '../utils/urUtils';
import { UR_SETTINGS } from '../constants';

/**
 * QR Code Resource Actions
 *
 * Operations for QR code generation, parsing, and animation.
 */

export async function execute(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<INodeExecutionData> {
  switch (operation) {
    case 'generate': {
      const data = this.getNodeParameter('data', itemIndex, '') as string;
      const format = this.getNodeParameter('qrFormat', itemIndex, 'dataUrl') as string;

      let qrCode: string;
      if (format === 'svg') {
        qrCode = await generateQRCodeSVG(data);
      } else {
        qrCode = await generateQRCode(data);
      }

      return {
        json: {
          qrCode,
          format,
          dataLength: data.length,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'generateAnimated': {
      const data = this.getNodeParameter('data', itemIndex, '') as string;
      const fragmentSize = this.getNodeParameter('fragmentSize', itemIndex, 200) as number;
      const fps = this.getNodeParameter('animationFps', itemIndex, 10) as number;

      const frames = await generateAnimatedQRFrames(data, {
        fragmentSize,
        frameRate: fps,
      });

      const estimation = estimateAnimationFrames(data.length, fragmentSize, 1.5);

      return {
        json: {
          frames,
          frameCount: frames.length,
          fps,
          estimatedDuration: estimation.estimatedDuration,
          dataLength: data.length,
          fragmentSize,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'parse': {
      const qrData = this.getNodeParameter('qrData', itemIndex, '') as string;

      const validation = validateQRFormat(qrData);

      return {
        json: {
          data: qrData,
          format: validation.format,
          isValid: validation.isValid,
          isUR: qrData.toLowerCase().startsWith('ur:'),
          length: qrData.length,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'parseAnimated': {
      const fragments = this.getNodeParameter('fragments', itemIndex, []) as string[];

      if (fragments.length === 0) {
        throw new Error('No fragments provided');
      }

      // Mock parsing of animated QR fragments
      const parsedFragments = fragments.map((frag, index) => ({
        index,
        data: frag,
        isValid: true,
      }));

      return {
        json: {
          fragments: parsedFragments,
          totalFragments: fragments.length,
          isComplete: true,
          reconstructedData: fragments.join(''),
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'encodeUr': {
      const data = this.getNodeParameter('data', itemIndex, '') as string;
      const urType = this.getNodeParameter('urType', itemIndex, 'bytes') as string;

      const dataBuffer = Buffer.from(data);
      const urString = encodeUR(urType, dataBuffer);

      return {
        json: {
          urString,
          type: urType,
          dataLength: data.length,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'decodeUr': {
      const urString = this.getNodeParameter('urString', itemIndex, '') as string;

      const validation = validateUR(urString);
      if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid UR string');
      }

      const decoded = decodeUR(urString);

      return {
        json: {
          type: decoded.type,
          data: decoded.payload.toString('base64'),
          dataLength: decoded.payload.length,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'split': {
      const data = this.getNodeParameter('data', itemIndex, '') as string;
      const fragmentSize = this.getNodeParameter('fragmentSize', itemIndex, 200) as number;

      const fragments = splitDataForAnimation(data, fragmentSize);

      return {
        json: {
          fragments,
          fragmentCount: fragments.length,
          originalLength: data.length,
          fragmentSize,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'mergeParts': {
      const parts = this.getNodeParameter('parts', itemIndex, []) as Array<{
        data: string;
        fragmentIndex: number;
        totalFragments: number;
      }>;

      if (parts.length === 0) {
        throw new Error('No parts provided');
      }

      const parsedParts = parts.map(p => ({
        data: p.data,
        type: 'fragment' as const,
        isAnimated: true,
        fragmentIndex: p.fragmentIndex,
        totalFragments: p.totalFragments,
      }));

      const merged = mergeQRFragments(parsedParts);

      return {
        json: {
          mergedData: merged,
          partsCount: parts.length,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'getFrames': {
      const data = this.getNodeParameter('data', itemIndex, '') as string;
      const fps = this.getNodeParameter('animationFps', itemIndex, 10) as number;

      const frames = await generateAnimatedQRFrames(data, { frameRate: fps });

      const framesWithTiming = frames.map((frame, index) => ({
        frame,
        index,
        displayTime: index * (1000 / fps),
      }));

      return {
        json: {
          frames: framesWithTiming,
          totalFrames: frames.length,
          fps,
          totalDuration: frames.length * (1000 / fps),
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'exportImage': {
      const data = this.getNodeParameter('data', itemIndex, '') as string;
      const format = this.getNodeParameter('imageFormat', itemIndex, 'png') as string;

      const qrCode = await generateQRCode(data);

      return {
        json: {
          image: qrCode,
          format,
          mimeType: format === 'svg' ? 'image/svg+xml' : 'image/png',
          dataLength: data.length,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    case 'validate': {
      const data = this.getNodeParameter('data', itemIndex, '') as string;

      const validation = validateQRFormat(data);

      // Check UR format if applicable
      let urValidation = null;
      if (data.toLowerCase().startsWith('ur:')) {
        urValidation = validateUR(data);
      }

      return {
        json: {
          isValid: validation.isValid,
          format: validation.format,
          urValidation,
          dataLength: data.length,
          maxCapacity: UR_SETTINGS.MAX_FRAGMENT_SIZE,
          needsAnimation: data.length > UR_SETTINGS.MAX_FRAGMENT_SIZE,
          timestamp: new Date().toISOString(),
        },
        pairedItem: { item: itemIndex },
      };
    }

    default:
      throw new Error(`Unknown QR Code operation: ${operation}`);
  }
}
