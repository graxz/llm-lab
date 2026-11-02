import { createHash } from 'node:crypto';
import { AppError } from '@llm-lab/domain';

export type ContextMessage = { role: 'user' | 'assistant' | 'system'; content: string; sequence: number };
export type ContextAssistant = { systemInstructions: string; model: string; temperature: number };
export type ContextInput = { assistant: ContextAssistant; history: ContextMessage[]; currentMessage: string; maxCharacters: number };
export type ConversationContext = { messages: ContextMessage[]; parameters: { model: string; temperature: number }; metadata: { maxCharacters: number; usedCharacters: number; truncatedMessages: number; contextHash: string } };

export class ContextLimitExceededError extends AppError { constructor() { super('CONTEXT_LIMIT_EXCEEDED', 413, 'The minimum context exceeds the configured limit'); this.name = 'ContextLimitExceededError'; } }
export class ContextInputInvalidError extends AppError { constructor() { super('INVALID_CONTEXT_INPUT', 400, 'A current message and a positive context limit are required'); this.name = 'ContextInputInvalidError'; } }

export class BuildConversationContextUseCase {
  execute(input: ContextInput): ConversationContext {
    const currentMessage = input.currentMessage.trim();
    if (!currentMessage || !Number.isInteger(input.maxCharacters) || input.maxCharacters <= 0) throw new ContextInputInvalidError();
    const systemMessage: ContextMessage = { role: 'system', content: input.assistant.systemInstructions, sequence: 0 };
    const current: ContextMessage = { role: 'user', content: currentMessage, sequence: Number.MAX_SAFE_INTEGER };
    const minimumSize = systemMessage.content.length + current.content.length;
    if (minimumSize > input.maxCharacters) throw new ContextLimitExceededError();
    const available = input.maxCharacters - minimumSize;
    const history = [...input.history].sort((left, right) => left.sequence - right.sequence);
    const retained: ContextMessage[] = [];
    let usedHistoryCharacters = 0;
    for (let index = history.length - 1; index >= 0; index -= 1) {
      const candidate = history[index];
      if (usedHistoryCharacters + candidate.content.length > available) break;
      retained.unshift(candidate);
      usedHistoryCharacters += candidate.content.length;
    }
    const messages = [systemMessage, ...retained, current];
    const serialized = messages.map(({ role, content }) => `${role}:${content}`).join('\n');
    return {
      messages,
      parameters: { model: input.assistant.model, temperature: input.assistant.temperature },
      metadata: { maxCharacters: input.maxCharacters, usedCharacters: serialized.length, truncatedMessages: history.length - retained.length, contextHash: createHash('sha256').update(serialized).digest('hex') },
    };
  }
}
