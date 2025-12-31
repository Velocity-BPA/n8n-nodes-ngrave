/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { NGrave } from '../../nodes/NGrave/NGrave.node';

describe('NGrave Node Integration', () => {
  let node: NGrave;

  beforeEach(() => {
    node = new NGrave();
  });

  describe('Node Description', () => {
    it('should have correct display name', () => {
      expect(node.description.displayName).toBe('NGRAVE ZERO');
    });

    it('should have correct node name', () => {
      expect(node.description.name).toBe('nGrave');
    });

    it('should have description', () => {
      expect(node.description.description).toContain('NGRAVE ZERO');
      expect(node.description.description).toContain('air-gapped');
    });

    it('should have icon defined', () => {
      expect(node.description.icon).toBe('file:ngrave.svg');
    });

    it('should be version 1', () => {
      expect(node.description.version).toBe(1);
    });
  });

  describe('Credentials', () => {
    it('should require NGRAVE ZERO credentials', () => {
      const zeroCredential = node.description.credentials?.find(
        c => c.name === 'nGraveZero'
      );
      expect(zeroCredential).toBeDefined();
      expect(zeroCredential?.required).toBe(true);
    });

    it('should have optional LIQUID credentials', () => {
      const liquidCredential = node.description.credentials?.find(
        c => c.name === 'nGraveLiquid'
      );
      expect(liquidCredential).toBeDefined();
      expect(liquidCredential?.required).toBe(false);
    });

    it('should have optional Network credentials', () => {
      const networkCredential = node.description.credentials?.find(
        c => c.name === 'nGraveNetwork'
      );
      expect(networkCredential).toBeDefined();
      expect(networkCredential?.required).toBe(false);
    });
  });

  describe('Resources', () => {
    it('should have resource property', () => {
      const resourceProp = node.description.properties?.find(
        p => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp?.type).toBe('options');
    });

    it('should have all 25 resources', () => {
      const resourceProp = node.description.properties?.find(
        p => p.name === 'resource'
      );
      const options = resourceProp?.options as Array<{ value: string }>;
      
      const expectedResources = [
        'account', 'backup', 'biometric', 'bitcoin', 'cardano',
        'cosmos', 'device', 'ethereum', 'evmChains', 'firmware',
        'graphene', 'liquid', 'multiChain', 'multisig', 'pin',
        'polkadot', 'psbt', 'qrCode', 'security', 'signing',
        'solana', 'transaction', 'utility', 'watchOnly', 'xrp'
      ];
      
      expectedResources.forEach(resource => {
        const found = options?.find(o => o.value === resource);
        expect(found).toBeDefined();
      });
    });
  });

  describe('Operations', () => {
    it('should have Device operations', () => {
      const operationProps = node.description.properties?.filter(
        p => p.name === 'operation' && 
             p.displayOptions?.show?.resource?.includes('device')
      );
      expect(operationProps?.length).toBeGreaterThan(0);
    });

    it('should have Bitcoin operations', () => {
      const operationProps = node.description.properties?.filter(
        p => p.name === 'operation' && 
             p.displayOptions?.show?.resource?.includes('bitcoin')
      );
      expect(operationProps?.length).toBeGreaterThan(0);
    });

    it('should have PSBT operations', () => {
      const operationProps = node.description.properties?.filter(
        p => p.name === 'operation' && 
             p.displayOptions?.show?.resource?.includes('psbt')
      );
      expect(operationProps?.length).toBeGreaterThan(0);
    });
  });

  describe('Inputs and Outputs', () => {
    it('should have main input', () => {
      expect(node.description.inputs).toContain('main');
    });

    it('should have main output', () => {
      expect(node.description.outputs).toContain('main');
    });
  });
});
