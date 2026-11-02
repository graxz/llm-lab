import { describe, expect, it, vi } from 'vitest';
import { AiGateway, GatewayProviderError, GatewayTimeoutError, GatewayValidationError } from './index.js';

const request = { messages: [{ role: 'user' as const, content: 'hello' }], model: 'gpt-4o-mini', temperature: 0.4, maxOutputTokens: 100 };

describe('AiGateway', () => {
  it('normalizes a provider response and assigns a generation id', async () => {
    const adapter = { generate: vi.fn().mockResolvedValue({ content: 'hi', promptTokens: 10, completionTokens: 2 }) };
    const result = await new AiGateway({ adapter }).generate(request);
    expect(result).toMatchObject({ content: 'hi', model: 'gpt-4o-mini', usage: { promptTokens: 10, completionTokens: 2 } });
    expect(result.generationId).toEqual(expect.any(String));
    expect(adapter.generate).toHaveBeenCalledWith(expect.objectContaining({ generationId: result.generationId }), expect.any(AbortSignal));
  });

  it('rejects disabled models before calling the adapter', async () => {
    const adapter = { generate: vi.fn() };
    await expect(new AiGateway({ adapter }).generate({ ...request, model: 'unknown' })).rejects.toThrow(GatewayValidationError);
    expect(adapter.generate).not.toHaveBeenCalled();
  });

  it('normalizes provider failures and timeouts', async () => {
    const failure = { generate: vi.fn().mockRejectedValue(new Error('secret provider detail')) };
    await expect(new AiGateway({ adapter: failure }).generate(request)).rejects.toThrow(GatewayProviderError);
    const slow = { generate: vi.fn((): Promise<never> => new Promise(() => undefined)) };
    await expect(new AiGateway({ adapter: slow, timeoutMs: 5 }).generate(request)).rejects.toThrow(GatewayTimeoutError);
  });

  it('emits started, deltas and completed events with one generation id', async () => {
    const adapter = { generate: vi.fn(), stream: async function* () { yield { content: 'he' }; yield { content: 'llo' }; } };
    const events = [];
    for await (const event of new AiGateway({ adapter }).stream(request)) events.push(event);
    expect(events.map((event) => event.type)).toEqual(['started', 'delta', 'delta', 'completed']);
    expect(events[1]).toMatchObject({ content: 'he' });
    expect(events[3]).toMatchObject({ content: 'hello' });
    expect(new Set(events.map((event) => event.generationId)).size).toBe(1);
  });

  it('emits an opaque error event when the stream fails', async () => {
    const adapter = { generate: vi.fn(), stream: async function* () { throw new Error('provider secret'); } };
    const events = [];
    for await (const event of new AiGateway({ adapter }).stream(request)) events.push(event);
    expect(events.at(-1)).toMatchObject({ type: 'error', code: 'PROVIDER_FAILURE' });
    expect(JSON.stringify(events)).not.toContain('provider secret');
  });
});
