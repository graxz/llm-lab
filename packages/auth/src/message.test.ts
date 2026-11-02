import { describe, expect, it } from 'vitest';
import { IdempotencyConflictError, MessageContentInvalidError, SendMessageUseCase } from './message.js';

describe('SendMessageUseCase', () => {
  const make = () => {
    const saved: any[] = [];
    const useCase = new SendMessageUseCase({
      conversations: { findForUser: () => ({ id: 'conversation-1', status: 'active' as const }) },
      messages: { findByIdempotencyKey: (conversationId, key) => saved.find((message) => message.conversationId === conversationId && message.idempotencyKey === key) ?? null, nextSequence: () => saved.length + 1, insert: (message) => saved.push(message) },
      idGenerator: () => `message-${saved.length + 1}`,
    });
    return { useCase, saved };
  };

  it('persists a valid message once for repeated idempotency keys', () => {
    const { useCase, saved } = make();
    const first = useCase.execute('user-1', 'conversation-1', '  hello  ', 'request-1');
    const second = useCase.execute('user-1', 'conversation-1', 'hello', 'request-1');
    expect(second).toEqual(first);
    expect(saved).toHaveLength(1);
    expect(first.sequence).toBe(1);
  });

  it('rejects empty content and conflicting retries', () => {
    const { useCase } = make();
    expect(() => useCase.execute('user-1', 'conversation-1', '   ', 'request-1')).toThrow(MessageContentInvalidError);
    useCase.execute('user-1', 'conversation-1', 'hello', 'request-1');
    expect(() => useCase.execute('user-1', 'conversation-1', 'different', 'request-1')).toThrow(IdempotencyConflictError);
  });
});
