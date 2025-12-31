/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Security Levels and Features for NGRAVE ZERO
 *
 * The NGRAVE ZERO is EAL7 certified - the highest Common Criteria
 * security certification achievable. This file defines security
 * levels and feature constants.
 */

/**
 * EAL (Evaluation Assurance Level) definitions
 */
export const EAL_LEVELS = {
  EAL1: {
    level: 1,
    name: 'Functionally Tested',
    description: 'Basic independent testing of security functionality',
  },
  EAL2: {
    level: 2,
    name: 'Structurally Tested',
    description: 'Analysis of security functions using high-level design',
  },
  EAL3: {
    level: 3,
    name: 'Methodically Tested and Checked',
    description: 'Methodical design, testing, and review',
  },
  EAL4: {
    level: 4,
    name: 'Methodically Designed, Tested, and Reviewed',
    description: 'Rigorous analysis and testing of design',
  },
  EAL5: {
    level: 5,
    name: 'Semiformally Designed and Tested',
    description: 'Semiformal design description and formal analysis',
  },
  EAL6: {
    level: 6,
    name: 'Semiformally Verified Design and Tested',
    description: 'Modular design with semiformal verification',
  },
  EAL7: {
    level: 7,
    name: 'Formally Verified Design and Tested',
    description: 'Formal representation and analysis of functional specification',
  },
} as const;

/**
 * NGRAVE ZERO security features
 */
export const SECURITY_FEATURES = {
  /** Air-gapped operation - no physical connectivity */
  AIR_GAPPED: {
    id: 'air-gapped',
    name: 'Air-Gapped Operation',
    description: 'No USB, Bluetooth, WiFi, or NFC - completely offline',
    enabled: true,
  },
  /** EAL7 certified secure element */
  EAL7_SECURE_ELEMENT: {
    id: 'eal7-se',
    name: 'EAL7 Secure Element',
    description: 'CC EAL7 certified secure element for key storage',
    enabled: true,
  },
  /** Light sensor for screen protection */
  LIGHT_SENSOR: {
    id: 'light-sensor',
    name: 'Light Sensor Protection',
    description: 'Detects attempts to read screen optically',
    enabled: true,
  },
  /** Tamper detection */
  TAMPER_DETECTION: {
    id: 'tamper-detection',
    name: 'Tamper Detection',
    description: 'Physical tamper detection mechanisms',
    enabled: true,
  },
  /** Biometric authentication */
  BIOMETRIC: {
    id: 'biometric',
    name: 'Fingerprint Authentication',
    description: 'Biometric verification for transactions',
    enabled: true,
  },
  /** PIN protection */
  PIN_PROTECTION: {
    id: 'pin',
    name: 'PIN Protection',
    description: 'Multi-attempt PIN with wipe protection',
    enabled: true,
  },
  /** Entropy from multiple sources */
  MULTI_SOURCE_ENTROPY: {
    id: 'entropy',
    name: 'Multi-Source Entropy',
    description: 'Combines hardware RNG, user input, and environmental factors',
    enabled: true,
  },
  /** GRAPHENE backup */
  GRAPHENE_BACKUP: {
    id: 'graphene',
    name: 'GRAPHENE Metal Backup',
    description: 'Stainless steel recovery phrase backup',
    enabled: true,
  },
} as const;

/**
 * Security status types
 */
export const SECURITY_STATUS = {
  SECURE: 'secure',
  WARNING: 'warning',
  COMPROMISED: 'compromised',
  UNKNOWN: 'unknown',
} as const;

/**
 * Tamper detection states
 */
export const TAMPER_STATUS = {
  NONE_DETECTED: 'none',
  PHYSICAL_TAMPER: 'physical',
  FIRMWARE_TAMPER: 'firmware',
  ENCLOSURE_BREACH: 'enclosure',
} as const;

/**
 * Light sensor states
 */
export const LIGHT_SENSOR_STATUS = {
  NORMAL: 'normal',
  SUSPICIOUS_ACTIVITY: 'suspicious',
  BLOCKED: 'blocked',
  DISABLED: 'disabled',
} as const;

/**
 * PIN attempt limits
 */
export const PIN_SETTINGS = {
  MIN_LENGTH: 4,
  MAX_LENGTH: 8,
  MAX_ATTEMPTS: 10,
  LOCKOUT_DURATION_MS: 300000, // 5 minutes
  WIPE_AFTER_ATTEMPTS: true,
} as const;

/**
 * Biometric settings
 */
export const BIOMETRIC_SETTINGS = {
  MAX_FINGERPRINTS: 5,
  REQUIRE_FOR_SIGNING: true,
  REQUIRE_FOR_UNLOCK: false,
  FALLBACK_TO_PIN: true,
} as const;

/**
 * Factory reset behavior
 */
export const FACTORY_RESET = {
  WIPES_KEYS: true,
  WIPES_SETTINGS: true,
  REQUIRES_CONFIRMATION: true,
  CONFIRMATION_STEPS: 3,
} as const;

/**
 * Get security level description
 */
export function getSecurityLevelDescription(level: number): string {
  const ealLevel = Object.values(EAL_LEVELS).find((eal) => eal.level === level);
  return ealLevel ? `${ealLevel.name}: ${ealLevel.description}` : 'Unknown security level';
}

/**
 * Security validation result
 */
export interface SecurityValidationResult {
  isSecure: boolean;
  status: (typeof SECURITY_STATUS)[keyof typeof SECURITY_STATUS];
  warnings: string[];
  features: {
    id: string;
    enabled: boolean;
    status: string;
  }[];
}

/**
 * Check if all security features are enabled
 */
export function validateSecurityFeatures(): SecurityValidationResult {
  const features = Object.values(SECURITY_FEATURES).map((feature) => ({
    id: feature.id,
    enabled: feature.enabled,
    status: feature.enabled ? 'active' : 'disabled',
  }));

  const disabledFeatures = features.filter((f) => !f.enabled);
  const warnings = disabledFeatures.map((f) => `Security feature ${f.id} is disabled`);

  return {
    isSecure: disabledFeatures.length === 0,
    status: disabledFeatures.length === 0 ? SECURITY_STATUS.SECURE : SECURITY_STATUS.WARNING,
    warnings,
    features,
  };
}
