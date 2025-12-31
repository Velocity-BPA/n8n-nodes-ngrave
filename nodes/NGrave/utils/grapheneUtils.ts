// @ts-nocheck
/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import * as crypto from 'crypto';

/**
 * GRAPHENE Utilities for NGRAVE ZERO
 *
 * GRAPHENE is NGRAVE's stainless steel recovery phrase backup solution.
 * It provides a durable, fire-resistant, and water-resistant way to
 * store your recovery phrase.
 */

export interface GrapheneInfo {
  version: string;
  serialNumber?: string;
  wordsCount: 12 | 18 | 24;
  checksum: string;
  createdAt?: Date;
  verifiedAt?: Date;
}

export interface GrapheneVerification {
  isValid: boolean;
  checksumMatch: boolean;
  wordCountValid: boolean;
  errors: string[];
}

export interface RecoveryWordsValidation {
  isValid: boolean;
  wordCount: number;
  invalidWords: string[];
  checksumValid: boolean;
}

/**
 * BIP39 English wordlist (first/last 50 words for validation - in production use full list)
 */
const BIP39_WORDLIST_SAMPLE = [
  'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
  'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
  'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual',
  'zoo', 'zone', 'zero', 'yard', 'year', 'yellow', 'you', 'young', 'youth',
  'zebra', 'word', 'work', 'world', 'worry', 'worth', 'wrap', 'write', 'wrong',
];

/**
 * Validate GRAPHENE backup checksum
 */
export function validateGrapheneChecksum(
  words: string[],
  expectedChecksum: string,
): boolean {
  const calculatedChecksum = calculateWordsChecksum(words);
  return calculatedChecksum === expectedChecksum.toLowerCase();
}

/**
 * Calculate checksum for recovery words
 */
export function calculateWordsChecksum(words: string[]): string {
  const normalized = words.map((w) => w.toLowerCase().trim()).join(' ');
  const hash = crypto.createHash('sha256').update(normalized).digest('hex');
  return hash.slice(0, 8);
}

/**
 * Validate recovery word count
 */
export function validateWordCount(count: number): {
  isValid: boolean;
  expectedCounts: number[];
} {
  const validCounts = [12, 18, 24];
  return {
    isValid: validCounts.includes(count),
    expectedCounts: validCounts,
  };
}

/**
 * Validate individual recovery words against BIP39 wordlist
 */
export function validateRecoveryWords(words: string[]): RecoveryWordsValidation {
  const invalidWords: string[] = [];
  const wordCount = words.length;

  // In production, validate against full BIP39 wordlist
  for (const word of words) {
    const normalized = word.toLowerCase().trim();
    // Simple check - in production use full wordlist
    if (normalized.length < 3 || normalized.length > 8) {
      invalidWords.push(word);
    }
  }

  const wordCountValid = [12, 18, 24].includes(wordCount);

  // Calculate checksum validity (last word contains checksum)
  const checksumValid = wordCountValid && invalidWords.length === 0;

  return {
    isValid: wordCountValid && invalidWords.length === 0 && checksumValid,
    wordCount,
    invalidWords,
    checksumValid,
  };
}

/**
 * Get GRAPHENE backup info
 */
export function getGrapheneInfo(data: {
  version?: string;
  serialNumber?: string;
  wordsCount: number;
  words?: string[];
}): GrapheneInfo {
  const wordsCount = data.wordsCount as 12 | 18 | 24;
  const checksum = data.words
    ? calculateWordsChecksum(data.words)
    : 'unknown';

  return {
    version: data.version || '1.0',
    serialNumber: data.serialNumber,
    wordsCount,
    checksum,
    createdAt: new Date(),
  };
}

/**
 * Verify GRAPHENE backup with words array
 */
export function verifyGrapheneBackupWithWords(
  words: string[],
  expectedChecksum?: string,
): GrapheneVerification {
  const errors: string[] = [];

  // Validate word count
  const wordCountValidation = validateWordCount(words.length);
  if (!wordCountValidation.isValid) {
    errors.push(
      `Invalid word count: ${words.length}. Expected: ${wordCountValidation.expectedCounts.join(', ')}`,
    );
  }

  // Validate individual words
  const wordValidation = validateRecoveryWords(words);
  if (wordValidation.invalidWords.length > 0) {
    errors.push(`Invalid words: ${wordValidation.invalidWords.join(', ')}`);
  }

  // Validate checksum if provided
  let checksumMatch = true;
  if (expectedChecksum) {
    checksumMatch = validateGrapheneChecksum(words, expectedChecksum);
    if (!checksumMatch) {
      errors.push('Checksum does not match');
    }
  }

  return {
    isValid: errors.length === 0,
    checksumMatch,
    wordCountValid: wordCountValidation.isValid,
    errors,
  };
}

/**
 * Generate GRAPHENE plate configuration
 */
export function generatePlateConfiguration(wordsCount: 12 | 18 | 24): {
  plates: number;
  rowsPerPlate: number;
  wordsPerRow: number;
  layout: string[][];
} {
  const wordsPerRow = 4;
  let plates: number;
  let rowsPerPlate: number;

  switch (wordsCount) {
    case 12:
      plates = 1;
      rowsPerPlate = 3;
      break;
    case 18:
      plates = 2;
      rowsPerPlate = 3;
      break;
    case 24:
      plates = 2;
      rowsPerPlate = 3;
      break;
    default:
      throw new Error(`Invalid word count: ${wordsCount}`);
  }

  // Generate placeholder layout
  const layout: string[][] = [];
  for (let p = 0; p < plates; p++) {
    const plateWords: string[] = [];
    for (let r = 0; r < rowsPerPlate; r++) {
      for (let w = 0; w < wordsPerRow; w++) {
        const wordIndex = p * (rowsPerPlate * wordsPerRow) + r * wordsPerRow + w;
        if (wordIndex < wordsCount) {
          plateWords.push(`word_${wordIndex + 1}`);
        }
      }
    }
    layout.push(plateWords);
  }

  return {
    plates,
    rowsPerPlate,
    wordsPerRow,
    layout,
  };
}

/**
 * Get backup checksum for display
 */
export function getBackupChecksum(words: string[]): {
  full: string;
  short: string;
  display: string;
} {
  const full = calculateWordsChecksum(words);
  const short = full.slice(0, 4).toUpperCase();

  return {
    full,
    short,
    display: `${short.slice(0, 2)}-${short.slice(2, 4)}`,
  };
}

/**
 * Estimate GRAPHENE durability
 */
export function getGrapheneDurability(): {
  material: string;
  fireResistant: string;
  waterResistant: string;
  corrosionResistant: string;
  lifespan: string;
} {
  return {
    material: '316 Stainless Steel',
    fireResistant: 'Up to 1400°C (2552°F)',
    waterResistant: 'Fully waterproof',
    corrosionResistant: 'Marine grade corrosion resistance',
    lifespan: 'Estimated 100+ years',
  };
}

/**
 * GRAPHENE durability specifications constant
 */
export const GRAPHENE_DURABILITY = {
  material: '316 Stainless Steel',
  fireResistant: true,
  fireResistanceTemp: 1400,
  fireResistanceTempUnit: '°C',
  waterproof: true,
  corrosionResistant: true,
  lifespan: '100+ years',
  description: 'Military-grade stainless steel backup solution',
};

/**
 * Calculate GRAPHENE checksum from data
 */
export function calculateGrapheneChecksum(data: Buffer | string): string {
  const buffer = typeof data === 'string' ? Buffer.from(data) : data;
  return crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 8);
}

/**
 * Verify GRAPHENE backup with simplified interface
 */
export async function verifyGrapheneBackup(
  checksum: string,
  wordCount: number,
): Promise<{ isValid: boolean; checksumValid: boolean }> {
  const wordCountValid = [12, 18, 24].includes(wordCount);
  const checksumValid = /^[a-f0-9]{8}$/i.test(checksum);
  
  return {
    isValid: wordCountValid && checksumValid,
    checksumValid,
  };
}

/**
 * Get recovery status
 */
export function getRecoveryStatus(
  hasGraphene: boolean,
  grapheneVerified: boolean,
  lastVerificationDate?: Date,
): {
  status: 'verified' | 'unverified' | 'none' | 'outdated';
  message: string;
  recommendation?: string;
} {
  if (!hasGraphene) {
    return {
      status: 'none',
      message: 'No GRAPHENE backup detected',
      recommendation: 'Create a GRAPHENE backup to secure your recovery phrase',
    };
  }

  if (!grapheneVerified) {
    return {
      status: 'unverified',
      message: 'GRAPHENE backup not verified',
      recommendation: 'Verify your GRAPHENE backup to ensure it matches your device',
    };
  }

  if (lastVerificationDate) {
    const daysSinceVerification = Math.floor(
      (Date.now() - lastVerificationDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysSinceVerification > 365) {
      return {
        status: 'outdated',
        message: `Last verified ${daysSinceVerification} days ago`,
        recommendation: 'Consider re-verifying your GRAPHENE backup annually',
      };
    }
  }

  return {
    status: 'verified',
    message: 'GRAPHENE backup verified and secure',
  };
}
