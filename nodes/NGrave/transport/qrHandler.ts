// @ts-nocheck
/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  generateQRCode,
  generateQRCodeSVG,
  generateQRCodeBuffer,
  generateAnimatedQRFrames,
  parseQRCode,
  mergeQRFragments,
  validateQRFormat,
  type QRCodeOptions,
  type AnimatedQROptions,
  type ParsedQRData,
} from '../utils/qrUtils';
import { encodeUR, decodeUR, validateUR, type URData } from '../utils/urUtils';
import { UR_SETTINGS } from '../constants';

/**
 * QR Handler for NGRAVE ZERO Air-Gapped Communication
 *
 * Manages QR code generation and parsing for air-gapped
 * communication between NGRAVE ZERO and external systems.
 */

export interface QRSession {
  id: string;
  type: 'single' | 'animated';
  urType?: string;
  fragments: ParsedQRData[];
  totalFragments: number;
  completedFragments: number;
  isComplete: boolean;
  startedAt: Date;
  data?: string;
}

export interface QRGenerationResult {
  qrCode: string;
  format: 'dataUrl' | 'svg' | 'buffer';
  urType?: string;
  isAnimated: boolean;
  frames?: string[];
  frameCount?: number;
}

export interface QRParseResult {
  success: boolean;
  data?: string;
  urType?: string;
  isAnimated: boolean;
  fragmentInfo?: {
    current: number;
    total: number;
    isComplete: boolean;
  };
  error?: string;
}

/**
 * Active QR sessions for animated sequences
 */
const activeSessions: Map<string, QRSession> = new Map();

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `qr-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate QR code for data
 */
export async function generateQR(
  data: string,
  options: QRCodeOptions & { format?: 'dataUrl' | 'svg' | 'buffer' } = {},
): Promise<QRGenerationResult> {
  const format = options.format || 'dataUrl';

  let qrCode: string | Buffer;
  switch (format) {
    case 'svg':
      qrCode = await generateQRCodeSVG(data, options);
      break;
    case 'buffer':
      qrCode = await generateQRCodeBuffer(data, options);
      break;
    default:
      qrCode = await generateQRCode(data, options);
  }

  // Check if data is UR
  const urValidation = validateUR(data);

  return {
    qrCode: typeof qrCode === 'string' ? qrCode : qrCode.toString('base64'),
    format,
    urType: urValidation.type,
    isAnimated: false,
  };
}

/**
 * Generate animated QR sequence for large data
 */
export async function generateAnimatedQR(
  data: string,
  options: AnimatedQROptions = {},
): Promise<QRGenerationResult> {
  const frames = await generateAnimatedQRFrames(data, options);

  return {
    qrCode: frames[0],
    format: 'dataUrl',
    isAnimated: true,
    frames,
    frameCount: frames.length,
  };
}

/**
 * Generate UR-encoded QR code
 */
export async function generateURQR(
  urType: string,
  data: Buffer,
  options: QRCodeOptions = {},
): Promise<QRGenerationResult> {
  const urString = encodeUR(urType, data);

  // Check if animated QR is needed
  if (urString.length > UR_SETTINGS.MAX_FRAGMENT_SIZE) {
    return generateAnimatedQR(urString, options);
  }

  return generateQR(urString, options);
}

/**
 * Start a new QR session for animated sequences
 */
export function startQRSession(expectedFragments?: number): QRSession {
  const session: QRSession = {
    id: generateSessionId(),
    type: expectedFragments && expectedFragments > 1 ? 'animated' : 'single',
    fragments: [],
    totalFragments: expectedFragments || 1,
    completedFragments: 0,
    isComplete: false,
    startedAt: new Date(),
  };

  activeSessions.set(session.id, session);
  return session;
}

/**
 * Add a fragment to an active session
 */
export function addFragmentToSession(
  sessionId: string,
  fragment: ParsedQRData,
): QRSession {
  const session = activeSessions.get(sessionId);
  if (!session) {
    throw new Error(`Session ${sessionId} not found`);
  }

  // Check for duplicate
  const existingIndex = session.fragments.findIndex(
    (f) => f.fragmentIndex === fragment.fragmentIndex,
  );

  if (existingIndex === -1) {
    session.fragments.push(fragment);
    session.completedFragments = session.fragments.length;
  }

  // Update total if we now know it
  if (fragment.totalFragments) {
    session.totalFragments = fragment.totalFragments;
  }

  // Check if complete
  if (session.completedFragments >= session.totalFragments) {
    session.isComplete = true;
    try {
      session.data = mergeQRFragments(session.fragments);
    } catch (error) {
      // Not all fragments collected yet
    }
  }

  return session;
}

/**
 * Get session status
 */
export function getSessionStatus(sessionId: string): QRSession | undefined {
  return activeSessions.get(sessionId);
}

/**
 * Complete and close a session
 */
export function closeSession(sessionId: string): QRSession | undefined {
  const session = activeSessions.get(sessionId);
  activeSessions.delete(sessionId);
  return session;
}

/**
 * Parse QR code from image data
 */
export function parseQR(
  imageData: Uint8ClampedArray,
  width: number,
  height: number,
  sessionId?: string,
): QRParseResult {
  const parsed = parseQRCode(imageData, width, height);

  if (!parsed) {
    return {
      success: false,
      isAnimated: false,
      error: 'No QR code found in image',
    };
  }

  // Handle animated sequence
  if (parsed.isAnimated && sessionId) {
    try {
      const session = addFragmentToSession(sessionId, parsed);

      return {
        success: true,
        isAnimated: true,
        data: session.isComplete ? session.data : undefined,
        fragmentInfo: {
          current: session.completedFragments,
          total: session.totalFragments,
          isComplete: session.isComplete,
        },
      };
    } catch (error) {
      return {
        success: false,
        isAnimated: true,
        error: error instanceof Error ? error.message : 'Failed to process fragment',
      };
    }
  }

  // Handle UR data
  if (parsed.type === 'ur') {
    try {
      const urData = decodeUR(parsed.data);
      return {
        success: true,
        data: urData.payload.toString('base64'),
        urType: urData.type,
        isAnimated: false,
      };
    } catch (error) {
      return {
        success: false,
        isAnimated: false,
        error: error instanceof Error ? error.message : 'Failed to decode UR',
      };
    }
  }

  // Plain data
  return {
    success: true,
    data: parsed.data,
    isAnimated: false,
  };
}

/**
 * Parse QR from base64 image
 */
export async function parseQRFromBase64(
  base64Image: string,
  sessionId?: string,
): Promise<QRParseResult> {
  // Remove data URL prefix if present
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

  // In a full implementation, this would decode the image and extract QR data
  // For now, we'll return an error indicating manual parsing is needed
  return {
    success: false,
    isAnimated: false,
    error: 'Image parsing requires browser environment. Use parseQR with raw image data.',
  };
}

/**
 * Validate QR data format
 */
export function validateQRData(data: string): {
  isValid: boolean;
  format: string;
  urType?: string;
  error?: string;
} {
  const formatValidation = validateQRFormat(data);

  if (!formatValidation.isValid) {
    return {
      isValid: false,
      format: formatValidation.format,
      error: formatValidation.error,
    };
  }

  // Additional UR validation
  if (formatValidation.format.startsWith('ur:')) {
    const urValidation = validateUR(data);
    return {
      isValid: urValidation.isValid,
      format: 'ur',
      urType: urValidation.type,
      error: urValidation.error,
    };
  }

  return {
    isValid: true,
    format: formatValidation.format,
  };
}

/**
 * Get animation settings for QR generation
 */
export function getAnimationSettings(
  dataSize: number,
  customSettings?: Partial<AnimatedQROptions>,
): AnimatedQROptions {
  const fragmentSize = customSettings?.fragmentSize || UR_SETTINGS.DEFAULT_FRAGMENT_SIZE;
  const frameRate = customSettings?.frameRate || UR_SETTINGS.DEFAULT_FPS;

  const estimatedFrames = Math.ceil(dataSize / fragmentSize);
  const redundantFrames = Math.ceil(estimatedFrames * UR_SETTINGS.REDUNDANCY_FACTOR);

  return {
    fragmentSize,
    frameRate,
    ...customSettings,
  };
}
