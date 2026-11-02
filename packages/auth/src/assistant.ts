import { randomUUID } from 'node:crypto';
import { AppError } from '@llm-lab/domain';

export type AssistantStatus = 'active' | 'inactive';

export type AssistantInput = {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  systemInstructions: string;
  model: string;
  temperature: number;
  status: AssistantStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateAssistantInput = {
  workspaceId: string;
  name: string;
  description?: string;
  systemInstructions: string;
  model: string;
  temperature: number;
};

export type AssistantRepository = {
  insert(assistant: AssistantInput): void;
  findAllByWorkspaceId(workspaceId: string): AssistantInput[];
  findByIdForWorkspace(id: string, workspaceId: string): AssistantInput | null;
  update(assistant: AssistantInput): void;
  softDelete(id: string): void;
};

export type WorkspaceAccess = {
  findByIdForUser(workspaceId: string, userId: string): { id: string; userId: string } | null;
};

export class InvalidAssistantConfigurationError extends AppError {
  constructor(message: string) {
    super('INVALID_ASSISTANT_CONFIGURATION', 400, message);
    this.name = 'InvalidAssistantConfigurationError';
  }
}

export class AssistantWorkspaceAccessDeniedError extends AppError {
  constructor() {
    super('WORKSPACE_ACCESS_DENIED', 403, 'You do not have access to this workspace');
    this.name = 'AssistantWorkspaceAccessDeniedError';
  }
}

const ALLOWED_MODELS = new Set(['gpt-4o-mini', 'gpt-4o']);

export class CreateAssistantUseCase {
  constructor(private readonly dependencies: { assistants: AssistantRepository; workspaces: WorkspaceAccess; idGenerator?: () => string }) {}

  execute(userId: string, input: CreateAssistantInput): AssistantInput {
    if (!this.dependencies.workspaces.findByIdForUser(input.workspaceId, userId)) throw new AssistantWorkspaceAccessDeniedError();
    if (!ALLOWED_MODELS.has(input.model)) throw new InvalidAssistantConfigurationError('Model is not available');

    const idGenerator = this.dependencies.idGenerator ?? randomUUID;
    const now = new Date();
    const assistant: AssistantInput = {
      id: idGenerator(),
      workspaceId: input.workspaceId,
      name: input.name,
      description: input.description ?? null,
      systemInstructions: input.systemInstructions,
      model: input.model,
      temperature: input.temperature,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };
    this.dependencies.assistants.insert(assistant);
    return assistant;
  }
}

export class ManageAssistantUseCase {
  constructor(private readonly assistants: AssistantRepository) {}

  list(workspaceId: string): AssistantInput[] { return this.assistants.findAllByWorkspaceId(workspaceId); }

  update(id: string, workspaceId: string, input: Partial<Pick<AssistantInput, 'name' | 'description' | 'systemInstructions' | 'model' | 'temperature' | 'status'>>): AssistantInput {
    const current = this.assistants.findByIdForWorkspace(id, workspaceId);
    if (!current) throw new AppError('ASSISTANT_NOT_FOUND', 404, 'Assistant not found');
    const updated = { ...current, ...input, updatedAt: new Date() };
    this.assistants.update(updated);
    return updated;
  }

  remove(id: string, workspaceId: string): void {
    if (!this.assistants.findByIdForWorkspace(id, workspaceId)) throw new AppError('ASSISTANT_NOT_FOUND', 404, 'Assistant not found');
    this.assistants.softDelete(id);
  }
}
