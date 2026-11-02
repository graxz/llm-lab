import { describe, expect, it } from 'vitest';
import { ModelNotAllowedError, ModelRegistry } from './models.js';

describe('ModelRegistry', () => {
  const registry = new ModelRegistry([{ id: 'enabled', label: 'Enabled', enabled: true, contextWindow: 100, maxOutputTokens: 20 }, { id: 'disabled', label: 'Disabled', enabled: false, contextWindow: 100, maxOutputTokens: 20 }]);
  it('lists only enabled models and returns a safe copy', () => { expect(registry.listEnabled().map((model) => model.id)).toEqual(['enabled']); });
  it('rejects arbitrary or disabled identifiers', () => { expect(() => registry.requireEnabled('disabled')).toThrow(ModelNotAllowedError); expect(() => registry.requireEnabled('arbitrary')).toThrow(ModelNotAllowedError); });
});
