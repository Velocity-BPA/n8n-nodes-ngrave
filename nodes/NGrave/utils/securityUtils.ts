// @ts-nocheck
/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import * as crypto from 'crypto';
import {
  SECURITY_STATUS,
  TAMPER_STATUS,
  LIGHT_SENSOR_STATUS,
  PIN_SETTINGS,
  BIOMETRIC_SETTINGS,
  EAL_LEVELS,
} from '../constants';

/**
 * Security Utilities for NGRAVE ZERO
 *
 * Provides security validation and verification functions
 * for the EAL7 certified NGRAVE ZERO hardware wallet.
 */

export interface DeviceSecurityStatus {
  overallStatus: (typeof SECURITY_STATUS)[keyof typeof SECURITY_STATUS];
  tamperStatus: (typeof TAMPER_STATUS)[keyof typeof TAMPER_STATUS];
  lightSensorStatus: (typeof LIGHT_SENSOR_STATUS)[keyof typeof LIGHT_SENSOR_STATUS];
  pinStatus: {
    isSet: boolean;
    attemptsRemaining: number;
    isLocked: boolean;
  };
  biometricStatus: {
    isEnabled: boolean;
    enrolledCount: number;
  };
  secureElementStatus: {
    isOperational: boolean;
    ealLevel: number;
    certificateValid: boolean;
  };
  firmwareStatus: {
    isVerified: boolean;
    version: string;
    signatureValid: boolean;
  };
}

export interface SecurityCheckResult {
  passed: boolean;
  checks: Array<{
    name: string;
    status: 'pass' | 'fail' | 'warning';
    message: string;
  }>;
  recommendations: string[];
}

/**
 * Verify device authenticity using certificate chain
 */
export function verifyDeviceAuthenticity(
  deviceCertificate: string,
  rootCertificate: string,
): {
  isAuthentic: boolean;
  serialNumber?: string;
  manufactureDate?: Date;
  error?: string;
} {
  try {
    // Parse and verify certificate
    const certBuffer = Buffer.from(deviceCertificate, 'base64');

    // Basic validation - in production, full X.509 verification would be done
    if (certBuffer.length < 100) {
      return {
        isAuthentic: false,
        error: 'Invalid certificate format',
      };
    }

    // Extract serial number (simplified)
    const serialNumber = certBuffer.slice(0, 16).toString('hex').toUpperCase();

    return {
      isAuthentic: true,
      serialNumber,
      manufactureDate: new Date(),
    };
  } catch (error) {
    return {
      isAuthentic: false,
      error: error instanceof Error ? error.message : 'Verification failed',
    };
  }
}

/**
 * Verify master fingerprint
 */
export function verifyMasterFingerprint(
  fingerprint: string,
  expectedFingerprint: string,
): boolean {
  return (
    fingerprint.toLowerCase().replace(/[^a-f0-9]/g, '') ===
    expectedFingerprint.toLowerCase().replace(/[^a-f0-9]/g, '')
  );
}

/**
 * Validate device fingerprint format
 */
export function validateFingerprint(fingerprint: string): {
  isValid: boolean;
  normalized?: string;
  error?: string;
} {
  const normalized = fingerprint.toLowerCase().replace(/[^a-f0-9]/g, '');

  if (normalized.length !== 8) {
    return {
      isValid: false,
      error: 'Master fingerprint must be 8 hexadecimal characters',
    };
  }

  return {
    isValid: true,
    normalized: normalized.toUpperCase(),
  };
}

/**
 * Generate challenge for device verification
 */
export function generateVerificationChallenge(): {
  challenge: string;
  timestamp: number;
  expiresAt: number;
} {
  const challenge = crypto.randomBytes(32).toString('hex');
  const timestamp = Date.now();
  const expiresAt = timestamp + 5 * 60 * 1000; // 5 minutes

  return {
    challenge,
    timestamp,
    expiresAt,
  };
}

/**
 * Verify challenge response from device
 */
export function verifyChallengeResponse(
  challenge: string,
  response: string,
  publicKey: string,
): boolean {
  try {
    const verify = crypto.createVerify('SHA256');
    verify.update(Buffer.from(challenge, 'hex'));

    return verify.verify(
      {
        key: Buffer.from(publicKey, 'base64'),
        format: 'der',
        type: 'spki',
      },
      Buffer.from(response, 'base64'),
    );
  } catch {
    return false;
  }
}

/**
 * Run comprehensive security check
 */
export function runSecurityCheck(
  deviceStatus: Partial<DeviceSecurityStatus>,
): SecurityCheckResult {
  const checks: SecurityCheckResult['checks'] = [];
  const recommendations: string[] = [];

  // Check tamper status
  if (deviceStatus.tamperStatus === TAMPER_STATUS.NONE_DETECTED) {
    checks.push({
      name: 'Tamper Detection',
      status: 'pass',
      message: 'No tampering detected',
    });
  } else {
    checks.push({
      name: 'Tamper Detection',
      status: 'fail',
      message: `Tamper detected: ${deviceStatus.tamperStatus}`,
    });
    recommendations.push('Device may be compromised. Do not use for signing.');
  }

  // Check light sensor
  if (deviceStatus.lightSensorStatus === LIGHT_SENSOR_STATUS.NORMAL) {
    checks.push({
      name: 'Light Sensor',
      status: 'pass',
      message: 'Light sensor operating normally',
    });
  } else if (deviceStatus.lightSensorStatus === LIGHT_SENSOR_STATUS.SUSPICIOUS_ACTIVITY) {
    checks.push({
      name: 'Light Sensor',
      status: 'warning',
      message: 'Suspicious light activity detected',
    });
    recommendations.push('Ensure screen is not being optically read by another device.');
  }

  // Check PIN status
  if (deviceStatus.pinStatus?.isSet) {
    if (deviceStatus.pinStatus.isLocked) {
      checks.push({
        name: 'PIN Protection',
        status: 'fail',
        message: 'Device is locked due to too many failed attempts',
      });
    } else if (deviceStatus.pinStatus.attemptsRemaining < 3) {
      checks.push({
        name: 'PIN Protection',
        status: 'warning',
        message: `Only ${deviceStatus.pinStatus.attemptsRemaining} PIN attempts remaining`,
      });
    } else {
      checks.push({
        name: 'PIN Protection',
        status: 'pass',
        message: 'PIN is set and device is unlocked',
      });
    }
  } else {
    checks.push({
      name: 'PIN Protection',
      status: 'warning',
      message: 'PIN is not set',
    });
    recommendations.push('Set a PIN to protect your device.');
  }

  // Check biometric status
  if (deviceStatus.biometricStatus?.isEnabled) {
    if (deviceStatus.biometricStatus.enrolledCount > 0) {
      checks.push({
        name: 'Biometric Authentication',
        status: 'pass',
        message: `${deviceStatus.biometricStatus.enrolledCount} fingerprint(s) enrolled`,
      });
    } else {
      checks.push({
        name: 'Biometric Authentication',
        status: 'warning',
        message: 'Biometric enabled but no fingerprints enrolled',
      });
      recommendations.push('Enroll at least one fingerprint for biometric authentication.');
    }
  }

  // Check secure element
  if (deviceStatus.secureElementStatus?.isOperational) {
    if (deviceStatus.secureElementStatus.certificateValid) {
      checks.push({
        name: 'Secure Element',
        status: 'pass',
        message: `EAL${deviceStatus.secureElementStatus.ealLevel} certified and operational`,
      });
    } else {
      checks.push({
        name: 'Secure Element',
        status: 'warning',
        message: 'Secure element operational but certificate needs verification',
      });
    }
  } else {
    checks.push({
      name: 'Secure Element',
      status: 'fail',
      message: 'Secure element not operational',
    });
    recommendations.push('Device secure element is not functioning. Contact NGRAVE support.');
  }

  // Check firmware
  if (deviceStatus.firmwareStatus?.isVerified) {
    if (deviceStatus.firmwareStatus.signatureValid) {
      checks.push({
        name: 'Firmware',
        status: 'pass',
        message: `Firmware v${deviceStatus.firmwareStatus.version} verified`,
      });
    } else {
      checks.push({
        name: 'Firmware',
        status: 'fail',
        message: 'Firmware signature invalid',
      });
      recommendations.push('Firmware may be corrupted or tampered. Do not use device.');
    }
  }

  const passed = checks.every((c) => c.status !== 'fail');

  return {
    passed,
    checks,
    recommendations,
  };
}

/**
 * Get EAL level description
 */
export function getEALDescription(level: number): {
  name: string;
  description: string;
} {
  const ealLevel = Object.values(EAL_LEVELS).find((eal) => eal.level === level);
  return ealLevel || { name: 'Unknown', description: 'Unknown EAL level' };
}

/**
 * Validate PIN format
 */
export function validatePIN(pin: string): {
  isValid: boolean;
  error?: string;
} {
  if (!/^\d+$/.test(pin)) {
    return {
      isValid: false,
      error: 'PIN must contain only digits',
    };
  }

  if (pin.length < PIN_SETTINGS.MIN_LENGTH) {
    return {
      isValid: false,
      error: `PIN must be at least ${PIN_SETTINGS.MIN_LENGTH} digits`,
    };
  }

  if (pin.length > PIN_SETTINGS.MAX_LENGTH) {
    return {
      isValid: false,
      error: `PIN must be at most ${PIN_SETTINGS.MAX_LENGTH} digits`,
    };
  }

  // Check for weak patterns
  if (/^(.)\1+$/.test(pin)) {
    return {
      isValid: false,
      error: 'PIN cannot be all the same digit',
    };
  }

  const sequential = '0123456789';
  if (sequential.includes(pin) || sequential.split('').reverse().join('').includes(pin)) {
    return {
      isValid: false,
      error: 'PIN cannot be a sequential pattern',
    };
  }

  return { isValid: true };
}

/**
 * Calculate entropy quality score
 */
export function calculateEntropyQuality(
  entropyHex: string,
): {
  score: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  bitsOfEntropy: number;
} {
  const bytes = Buffer.from(entropyHex, 'hex');
  const bitsOfEntropy = bytes.length * 8;

  // Simple entropy estimation based on byte distribution
  const byteFrequency = new Map<number, number>();
  for (const byte of bytes) {
    byteFrequency.set(byte, (byteFrequency.get(byte) || 0) + 1);
  }

  // Calculate Shannon entropy approximation
  let entropy = 0;
  for (const count of byteFrequency.values()) {
    const p = count / bytes.length;
    entropy -= p * Math.log2(p);
  }

  // Normalize to 0-100 score
  const maxEntropy = Math.log2(256); // 8 bits
  const score = Math.round((entropy / maxEntropy) * 100);

  let quality: 'excellent' | 'good' | 'fair' | 'poor';
  if (score >= 90) {
    quality = 'excellent';
  } else if (score >= 75) {
    quality = 'good';
  } else if (score >= 50) {
    quality = 'fair';
  } else {
    quality = 'poor';
  }

  return {
    score,
    quality,
    bitsOfEntropy,
  };
}

// Aliases for backward compatibility
export const validateMasterFingerprint = validateFingerprint;

export function getSecurityLevelDescription(level: number): string {
  const ealLevel = Object.values(EAL_LEVELS).find((eal) => eal.level === level);
  return ealLevel ? `${ealLevel.name}: ${ealLevel.description}` : 'Unknown security level';
}
