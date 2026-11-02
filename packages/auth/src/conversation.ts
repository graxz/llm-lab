import { randomUUID } from 'node:crypto';
import { AppError } from '@llm-lab/domain';
import type { WorkspaceAccess } from './assistant.js';

export type ConversationInput = { id: string; workspaceId: string; assistantId: string; userId: string; title: string; status: 'active' | 'archived'; createdAt: Date; updatedAt: Date };
export type ConversationRepository = { insert(conversation: ConversationInput): void };
export type ConversationAccess = { findByIdForWorkspace(id: string, workspaceId: string): { id: string; status: 'active' | 'inactive' } | null };

export class ConversationAssistantUnavailableError extends AppError {
  constructor() { super('ASSISTANT_UNAVAILABLE', 404, 'Assistant is unavailable'); this.name = 'ConversationAssistantUnavailableError'; }
}

export class ConversationWorkspaceAccessDeniedError extends AppError {
  constructor() { super('WORKSPACE_ACCESS_DENIED', 403, 'You do not have access to this workspace'); this.name = 'ConversationWorkspaceAccessDeniedError'; }
}

export class CreateConversationUseCase {
  constructor(private readonly dependencies: { conversations: ConversationRepository; assistants: ConversationAccess; workspaces: WorkspaceAccess; idGenerator?: () => string }) {}
  execute(userId: string, workspaceId: string, assistantId: string, title?: string): ConversationInput {
    if (!this.dependencies.workspaces.findByIdForUser(workspaceId, userId)) throw new ConversationWorkspaceAccessDeniedError();
    const assistant = this.dependencies.assistants.findByIdForWorkspace(assistantId, workspaceId);
    if (!assistant || assistant.status !== 'active') throw new ConversationAssistantUnavailableError();
    const now = new Date();
    const conversation = { id: (this.dependencies.idGenerator ?? randomUUID)(), workspaceId, assistantId, userId, title: title?.trim() || 'New conversation', status: 'active' as const, createdAt: now, updatedAt: now };
    this.dependencies.conversations.insert(conversation);
    return conversation;
  }
}
