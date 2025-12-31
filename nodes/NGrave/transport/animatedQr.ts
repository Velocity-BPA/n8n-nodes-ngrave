// @ts-nocheck
/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { UR_SETTINGS } from '../constants';
import {
  generateAnimatedQRFrames,
  splitDataForAnimation,
  estimateAnimationFrames,
  type AnimatedQROptions,
} from '../utils/qrUtils';

/**
 * Animated QR Handler for NGRAVE ZERO
 *
 * Handles large data transfer using animated QR code sequences.
 * Uses fountain codes for efficient data transmission over
 * unreliable visual channels.
 */

export interface AnimationConfig {
  frameRate: number;
  fragmentSize: number;
  redundancyFactor: number;
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
}

export interface AnimationSequence {
  id: string;
  frames: string[];
  frameCount: number;
  totalBytes: number;
  estimatedDuration: number;
  config: AnimationConfig;
  createdAt: Date;
}

export interface AnimationPlayback {
  sequenceId: string;
  currentFrame: number;
  isPlaying: boolean;
  loopCount: number;
  startedAt?: Date;
}

export interface ReconstructionSession {
  id: string;
  expectedFragments: number;
  receivedFragments: Map<number, string>;
  isComplete: boolean;
  startedAt: Date;
  lastUpdatedAt: Date;
}

/**
 * Active animation sequences
 */
const sequences: Map<string, AnimationSequence> = new Map();

/**
 * Active reconstruction sessions
 */
const reconstructions: Map<string, ReconstructionSession> = new Map();

/**
 * Generate unique ID
 */
function generateId(): string {
  return `anim-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create animation sequence from data
 */
export async function createAnimationSequence(
  data: string,
  options: Partial<AnimationConfig> = {},
): Promise<AnimationSequence> {
  const config: AnimationConfig = {
    frameRate: options.frameRate || UR_SETTINGS.DEFAULT_FPS,
    fragmentSize: options.fragmentSize || UR_SETTINGS.DEFAULT_FRAGMENT_SIZE,
    redundancyFactor: options.redundancyFactor || UR_SETTINGS.REDUNDANCY_FACTOR,
    errorCorrection: options.errorCorrection || 'M',
  };

  const frames = await generateAnimatedQRFrames(data, {
    fragmentSize: config.fragmentSize,
    frameRate: config.frameRate,
    errorCorrectionLevel: config.errorCorrection,
  });

  const { estimatedDuration } = estimateAnimationFrames(
    data.length,
    config.fragmentSize,
    config.redundancyFactor,
  );

  const sequence: AnimationSequence = {
    id: generateId(),
    frames,
    frameCount: frames.length,
    totalBytes: data.length,
    estimatedDuration,
    config,
    createdAt: new Date(),
  };

  sequences.set(sequence.id, sequence);
  return sequence;
}

/**
 * Get animation sequence by ID
 */
export function getAnimationSequence(sequenceId: string): AnimationSequence | undefined {
  return sequences.get(sequenceId);
}

/**
 * Get frame at specific index
 */
export function getFrame(sequenceId: string, frameIndex: number): string | undefined {
  const sequence = sequences.get(sequenceId);
  if (!sequence || frameIndex < 0 || frameIndex >= sequence.frameCount) {
    return undefined;
  }
  return sequence.frames[frameIndex];
}

/**
 * Get all frames with timing info
 */
export function getFramesWithTiming(
  sequenceId: string,
): Array<{ frame: string; displayTime: number; index: number }> | undefined {
  const sequence = sequences.get(sequenceId);
  if (!sequence) {
    return undefined;
  }

  const frameDuration = 1000 / sequence.config.frameRate;

  return sequence.frames.map((frame, index) => ({
    frame,
    displayTime: index * frameDuration,
    index,
  }));
}

/**
 * Create playback controller
 */
export function createPlayback(sequenceId: string): AnimationPlayback | undefined {
  const sequence = sequences.get(sequenceId);
  if (!sequence) {
    return undefined;
  }

  return {
    sequenceId,
    currentFrame: 0,
    isPlaying: false,
    loopCount: 0,
  };
}

/**
 * Advance playback to next frame
 */
export function advancePlayback(playback: AnimationPlayback): {
  frame: string | undefined;
  isLoopComplete: boolean;
} {
  const sequence = sequences.get(playback.sequenceId);
  if (!sequence) {
    return { frame: undefined, isLoopComplete: false };
  }

  const frame = sequence.frames[playback.currentFrame];
  playback.currentFrame++;

  let isLoopComplete = false;
  if (playback.currentFrame >= sequence.frameCount) {
    playback.currentFrame = 0;
    playback.loopCount++;
    isLoopComplete = true;
  }

  return { frame, isLoopComplete };
}

/**
 * Start reconstruction session for receiving animated QR
 */
export function startReconstructionSession(
  expectedFragments?: number,
): ReconstructionSession {
  const session: ReconstructionSession = {
    id: generateId(),
    expectedFragments: expectedFragments || 0,
    receivedFragments: new Map(),
    isComplete: false,
    startedAt: new Date(),
    lastUpdatedAt: new Date(),
  };

  reconstructions.set(session.id, session);
  return session;
}

/**
 * Add received fragment to reconstruction session
 */
export function addReceivedFragment(
  sessionId: string,
  fragmentIndex: number,
  fragmentData: string,
  totalFragments?: number,
): {
  progress: number;
  isComplete: boolean;
  missingFragments: number[];
} {
  const session = reconstructions.get(sessionId);
  if (!session) {
    throw new Error(`Session ${sessionId} not found`);
  }

  session.receivedFragments.set(fragmentIndex, fragmentData);
  session.lastUpdatedAt = new Date();

  if (totalFragments && session.expectedFragments === 0) {
    session.expectedFragments = totalFragments;
  }

  const receivedCount = session.receivedFragments.size;
  const expectedCount = session.expectedFragments || receivedCount;

  const progress = expectedCount > 0 ? receivedCount / expectedCount : 0;
  const isComplete = receivedCount >= expectedCount && expectedCount > 0;

  // Find missing fragments
  const missingFragments: number[] = [];
  if (expectedCount > 0) {
    for (let i = 0; i < expectedCount; i++) {
      if (!session.receivedFragments.has(i)) {
        missingFragments.push(i);
      }
    }
  }

  session.isComplete = isComplete;

  return {
    progress,
    isComplete,
    missingFragments,
  };
}

/**
 * Reconstruct data from received fragments
 */
export function reconstructData(sessionId: string): string | undefined {
  const session = reconstructions.get(sessionId);
  if (!session || !session.isComplete) {
    return undefined;
  }

  // Sort fragments by index and join
  const sortedFragments = Array.from(session.receivedFragments.entries())
    .sort(([a], [b]) => a - b)
    .map(([, data]) => data);

  return sortedFragments.join('');
}

/**
 * Get reconstruction session status
 */
export function getReconstructionStatus(sessionId: string): {
  found: boolean;
  progress?: number;
  receivedCount?: number;
  expectedCount?: number;
  isComplete?: boolean;
  elapsedMs?: number;
} {
  const session = reconstructions.get(sessionId);
  if (!session) {
    return { found: false };
  }

  const receivedCount = session.receivedFragments.size;
  const expectedCount = session.expectedFragments || 0;
  const progress = expectedCount > 0 ? receivedCount / expectedCount : 0;

  return {
    found: true,
    progress,
    receivedCount,
    expectedCount,
    isComplete: session.isComplete,
    elapsedMs: Date.now() - session.startedAt.getTime(),
  };
}

/**
 * Clean up old sessions
 */
export function cleanupSessions(maxAgeMs: number = 300000): number {
  let cleaned = 0;
  const now = Date.now();

  for (const [id, session] of reconstructions) {
    if (now - session.startedAt.getTime() > maxAgeMs) {
      reconstructions.delete(id);
      cleaned++;
    }
  }

  for (const [id, sequence] of sequences) {
    if (now - sequence.createdAt.getTime() > maxAgeMs) {
      sequences.delete(id);
      cleaned++;
    }
  }

  return cleaned;
}

/**
 * Calculate optimal animation settings for data size
 */
export function calculateOptimalSettings(
  dataSizeBytes: number,
  targetDurationSeconds?: number,
): AnimationConfig {
  const targetDuration = targetDurationSeconds || 5;

  // Calculate fragment size to fit within target duration
  const framesNeeded = Math.ceil(dataSizeBytes / UR_SETTINGS.MIN_FRAGMENT_SIZE);
  const optimalFps = Math.min(
    30,
    Math.max(5, Math.ceil(framesNeeded / targetDuration)),
  );

  // Calculate fragment size
  const optimalFragmentSize = Math.min(
    UR_SETTINGS.MAX_FRAGMENT_SIZE,
    Math.max(
      UR_SETTINGS.MIN_FRAGMENT_SIZE,
      Math.ceil(dataSizeBytes / (targetDuration * optimalFps)),
    ),
  );

  return {
    frameRate: optimalFps,
    fragmentSize: optimalFragmentSize,
    redundancyFactor: UR_SETTINGS.REDUNDANCY_FACTOR,
    errorCorrection: 'M',
  };
}
