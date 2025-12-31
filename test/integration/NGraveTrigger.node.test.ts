/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { NGraveTrigger } from '../../nodes/NGrave/NGraveTrigger.node';

describe('NGraveTrigger Node Integration', () => {
  let triggerNode: NGraveTrigger;

  beforeEach(() => {
    triggerNode = new NGraveTrigger();
  });

  describe('Node Description', () => {
    it('should have correct display name', () => {
      expect(triggerNode.description.displayName).toBe('NGRAVE ZERO Trigger');
    });

    it('should have correct node name', () => {
      expect(triggerNode.description.name).toBe('nGraveTrigger');
    });

    it('should be a trigger node', () => {
      expect(triggerNode.description.group).toContain('trigger');
    });

    it('should have description', () => {
      expect(triggerNode.description.description).toContain('NGRAVE');
    });

    it('should have version 1', () => {
      expect(triggerNode.description.version).toBe(1);
    });
  });

  describe('Credentials', () => {
    it('should require NGRAVE LIQUID credentials', () => {
      const credential = triggerNode.description.credentials?.find(
        c => c.name === 'nGraveLiquid'
      );
      expect(credential).toBeDefined();
      expect(credential?.required).toBe(true);
    });
  });

  describe('Event Categories', () => {
    it('should have eventCategory property', () => {
      const eventCategoryProp = triggerNode.description.properties?.find(
        p => p.name === 'eventCategory'
      );
      expect(eventCategoryProp).toBeDefined();
      expect(eventCategoryProp?.type).toBe('options');
    });

    it('should include QR category', () => {
      const eventCategoryProp = triggerNode.description.properties?.find(
        p => p.name === 'eventCategory'
      );
      const options = eventCategoryProp?.options as Array<{ value: string }>;
      const qrOption = options?.find(o => o.value === 'qr');
      expect(qrOption).toBeDefined();
    });

    it('should include signing category', () => {
      const eventCategoryProp = triggerNode.description.properties?.find(
        p => p.name === 'eventCategory'
      );
      const options = eventCategoryProp?.options as Array<{ value: string }>;
      const signingOption = options?.find(o => o.value === 'signing');
      expect(signingOption).toBeDefined();
    });

    it('should include device category', () => {
      const eventCategoryProp = triggerNode.description.properties?.find(
        p => p.name === 'eventCategory'
      );
      const options = eventCategoryProp?.options as Array<{ value: string }>;
      const deviceOption = options?.find(o => o.value === 'device');
      expect(deviceOption).toBeDefined();
    });

    it('should have 8 event categories', () => {
      const eventCategoryProp = triggerNode.description.properties?.find(
        p => p.name === 'eventCategory'
      );
      const options = eventCategoryProp?.options as Array<{ value: string }>;
      expect(options).toHaveLength(8);
    });
  });

  describe('Inputs and Outputs', () => {
    it('should have no inputs (trigger node)', () => {
      expect(triggerNode.description.inputs).toEqual([]);
    });

    it('should have main output', () => {
      expect(triggerNode.description.outputs).toContain('main');
    });
  });

  describe('Trigger Method', () => {
    it('should have trigger method defined', () => {
      expect(typeof triggerNode.trigger).toBe('function');
    });
  });
});
