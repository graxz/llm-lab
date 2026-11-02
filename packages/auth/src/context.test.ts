import { describe, expect, it } from 'vitest';
import { BuildConversationContextUseCase, ContextLimitExceededError } from './context.js';

describe('BuildConversationContextUseCase', () => {
  const assistant = { systemInstructions: 'You are helpful', model: 'gpt-4o-mini', temperature: 0.2 };
  it('keeps system instructions, relevant history and current message in order', () => {
    const result = new BuildConversationContextUseCase().execute({ assistant, currentMessage: 'current', maxCharacters: 100, history: [{ role: 'assistant', content: 'second', sequence: 2 }, { role: 'user', content: 'first', sequence: 1 }] });
    expect(result.messages.map((message) => message.content)).toEqual(['You are helpful', 'first', 'second', 'current']);
    expect(result.metadata.truncatedMessages).toBe(0);
  });

  it('truncates oldest messages predictably and reports metadata', () => {
    const result = new BuildConversationContextUseCase().execute({ assistant, currentMessage: 'current', maxCharacters: 25, history: [{ role: 'user', content: 'old', sequence: 1 }, { role: 'assistant', content: 'new', sequence: 2 }] });
    expect(result.messages.map((message) => message.content)).toEqual(['You are helpful', 'new', 'current']);
    expect(result.metadata.truncatedMessages).toBe(1);
  });

  it('fails when instructions and current message cannot fit', () => {
    expect(() => new BuildConversationContextUseCase().execute({ assistant, currentMessage: 'current', maxCharacters: 10, history: [] })).toThrow(ContextLimitExceededError);
  });
});
