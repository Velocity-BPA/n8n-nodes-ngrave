// @ts-nocheck
/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import QRCode, { QRCodeErrorCorrectionLevel, QRCodeToDataURLOptions, QRCodeToStringOptions } from 'qrcode';

/**
 * QR Code Utilities for NGRAVE ZERO
 *
 * Handles QR code generation and parsing for air-gapped communication.
 */

export interface QRCodeOptions {
  errorCorrectionLevel?: QRCodeErrorCorrectionLevel;
  width?: number;
  margin?: number;
  dark?: string;
  light?: string;
}

export interface AnimatedQROptions extends QRCodeOptions {
  frameRate?: number;
  fragmentSize?: number;
}

export interface ParsedQRData {
  data: string;
  type: string;
  isAnimated: boolean;
  fragmentIndex?: number;
  totalFragments?: number;
}

export interface QRFragment {
  index: number;
  total: number;
  data: string;
}

/**
 * Generate a QR code as a data URL
 */
export async function generateQRCode(
  data: string,
  options: QRCodeOptions = {},
): Promise<string> {
  if (!data) {
    throw new Error('QR code data cannot be empty');
  }

  const qrOptions: QRCodeToDataURLOptions = {
    errorCorrectionLevel: options.errorCorrectionLevel || 'M',
    width: options.width || 400,
    margin: options.margin || 4,
    color: {
      dark: options.dark || '#000000',
      light: options.light || '#ffffff',
    },
  };

  return QRCode.toDataURL(data, qrOptions);
}

// Alias for compatibility
export const generateQrCode = generateQRCode;

/**
 * Generate a QR code as SVG string
 */
export async function generateQRCodeSVG(
  data: string,
  options: QRCodeOptions = {},
): Promise<string> {
  const qrOptions: QRCodeToStringOptions = {
    type: 'svg',
    errorCorrectionLevel: options.errorCorrectionLevel || 'M',
    width: options.width || 400,
    margin: options.margin || 4,
    color: {
      dark: options.dark || '#000000',
      light: options.light || '#ffffff',
    },
  };

  return QRCode.toString(data, qrOptions);
}

/**
 * Generate QR code as PNG buffer
 */
export async function generateQRCodeBuffer(
  data: string,
  options: QRCodeOptions = {},
): Promise<Buffer> {
  const qrOptions: QRCodeToDataURLOptions = {
    errorCorrectionLevel: options.errorCorrectionLevel || 'M',
    width: options.width || 400,
    margin: options.margin || 4,
    color: {
      dark: options.dark || '#000000',
      light: options.light || '#ffffff',
    },
  };

  return QRCode.toBuffer(data, qrOptions);
}

/**
 * Split data into fragments for animated QR sequence
 */
export function splitIntoFragments(
  data: string,
  fragmentSize: number = 200,
): QRFragment[] {
  const fragments: QRFragment[] = [];
  const totalFragments = Math.ceil(data.length / fragmentSize);

  for (let i = 0; i < totalFragments; i++) {
    const start = i * fragmentSize;
    const end = Math.min(start + fragmentSize, data.length);
    fragments.push({
      index: i,
      total: totalFragments,
      data: data.slice(start, end),
    });
  }

  return fragments;
}

/**
 * Merge QR fragments back into original data
 */
export function mergeFragments(fragments: QRFragment[]): string {
  // Sort by index
  const sorted = [...fragments].sort((a, b) => a.index - b.index);
  return sorted.map(f => f.data).join('');
}

/**
 * Generate animated QR code sequence
 */
export async function generateAnimatedQRSequence(
  data: string,
  options: AnimatedQROptions = {},
): Promise<string[]> {
  const fragmentSize = options.fragmentSize || 200;
  const fragments = splitIntoFragments(data, fragmentSize);

  const qrCodes: string[] = [];
  for (const fragment of fragments) {
    const encodedFragment = JSON.stringify({
      i: fragment.index,
      t: fragment.total,
      d: fragment.data,
    });
    const qrCode = await generateQRCode(encodedFragment, options);
    qrCodes.push(qrCode);
  }

  return qrCodes;
}

/**
 * Parse QR code data and detect type
 */
export function parseQRCode(data: string): ParsedQRData {
  // Check for UR format
  if (data.toLowerCase().startsWith('ur:')) {
    const urType = data.split('/')[0].substring(3);
    return {
      data,
      type: `ur:${urType}`,
      isAnimated: false,
    };
  }

  // Check for animated fragment
  try {
    const parsed = JSON.parse(data);
    if (typeof parsed.i === 'number' && typeof parsed.t === 'number' && parsed.d) {
      return {
        data: parsed.d,
        type: 'animated-fragment',
        isAnimated: true,
        fragmentIndex: parsed.i,
        totalFragments: parsed.t,
      };
    }
  } catch {
    // Not JSON, continue
  }

  // Check for base64
  const base64Pattern = /^[A-Za-z0-9+/]+=*$/;
  if (base64Pattern.test(data) && data.length % 4 === 0) {
    return {
      data,
      type: 'base64',
      isAnimated: false,
    };
  }

  // Check for hex
  const hexPattern = /^[0-9a-fA-F]+$/;
  if (hexPattern.test(data)) {
    return {
      data,
      type: 'hex',
      isAnimated: false,
    };
  }

  return {
    data,
    type: 'unknown',
    isAnimated: false,
  };
}

// Alias for compatibility
export const parseQrCode = parseQRCode;

/**
 * Validate QR code data
 */
export function validateQrData(data: string): { valid: boolean; format: string; error?: string } {
  if (!data || data.trim() === '') {
    return { valid: false, format: 'empty', error: 'Data is empty' };
  }

  // Check for UR format
  if (data.toLowerCase().startsWith('ur:')) {
    return { valid: true, format: 'ur' };
  }

  // Check for base64
  const base64Pattern = /^[A-Za-z0-9+/]+=*$/;
  if (base64Pattern.test(data) && data.length >= 4) {
    return { valid: true, format: 'base64' };
  }

  // Check for hex
  const hexPattern = /^[0-9a-fA-F]+$/;
  if (hexPattern.test(data)) {
    return { valid: true, format: 'hex' };
  }

  // Check for JSON
  try {
    JSON.parse(data);
    return { valid: true, format: 'json' };
  } catch {
    // Not JSON
  }

  return { valid: true, format: 'text' };
}

/**
 * Get QR code as data URL
 */
export async function getQrDataUrl(data: string, format: 'png' | 'svg' = 'png'): Promise<string> {
  if (format === 'svg') {
    const svg = await generateQRCodeSVG(data);
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  }
  return generateQRCode(data);
}

/**
 * Calculate QR code capacity
 */
export function getQRCapacity(
  errorCorrectionLevel: QRCodeErrorCorrectionLevel = 'M',
): { alphanumeric: number; binary: number } {
  const capacityMap: Record<QRCodeErrorCorrectionLevel, { alphanumeric: number; binary: number }> = {
    L: { alphanumeric: 4296, binary: 2953 },
    M: { alphanumeric: 3391, binary: 2331 },
    Q: { alphanumeric: 2420, binary: 1663 },
    H: { alphanumeric: 1852, binary: 1273 },
  };

  return capacityMap[errorCorrectionLevel];
}
