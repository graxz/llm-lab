import { randomUUID } from 'node:crypto';
import { AppError } from '@llm-lab/domain';

export type MessageInput = { id: string; conversationId: string; authorId: string; type: 'user'; content: string; sequence: number; status: 'persisted'; idempotencyKey: string; createdAt: Date };
export type ConversationMessageAccess = { findForUser(id: string, userId: string): { id: string; status: 'active' | 'archived' } | null };
export type MessageRepository = { findByIdempotencyKey(conversationId: string, key: string): MessageInput | null; nextSequence(conversationId: string): number; insert(message: MessageInput): void };

export class ConversationUnavailableError extends AppError { constructor() { super('CONVERSATION_NOT_FOUND', 404, 'Conversation was not found'); this.name = 'ConversationUnavailableError'; } }
export class MessageContentInvalidError extends AppError { constructor() { super('INVALID_MESSAGE_CONTENT', 400, 'Message content must contain between 1 and 12000 characters'); this.name = 'MessageContentInvalidError'; } }
export class IdempotencyConflictError extends AppError { constructor() { super('IDEMPOTENCY_CONFLICT', 409, 'Idempotency key is already used for another message'); this.name = 'IdempotencyConflictError'; } }

export class SendMessageUseCase {
  constructor(private readonly dependencies: { conversations: ConversationMessageAccess; messages: MessageRepository; idGenerator?: () => string }) {}
  execute(userId: string, conversationId: string, content: string, idempotencyKey: string): MessageInput {
    const conversation = this.dependencies.conversations.findForUser(conversationId, userId);
    if (!conversation || conversation.status !== 'active') throw new ConversationUnavailableError();
    const normalizedContent = content.trim();
    if (normalizedContent.length < 1 || normalizedContent.length > 12000) throw new MessageContentInvalidError();
    const existing = this.dependencies.messages.findByIdempotencyKey(conversationId, idempotencyKey);
    if (existing) {
      if (existing.content !== normalizedContent) throw new IdempotencyConflictError();
      return existing;
    }
    const message: MessageInput = { id: (this.dependencies.idGenerator ?? randomUUID)(), conversationId, authorId: userId, type: 'user', content: normalizedContent, sequence: this.dependencies.messages.nextSequence(conversationId), status: 'persisted', idempotencyKey, createdAt: new Date() };
    this.dependencies.messages.insert(message);
    return message;
  }
}
