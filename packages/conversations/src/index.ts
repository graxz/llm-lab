import { randomUUID } from 'node:crypto';

export type GenerationStatus = 'pending' | 'streaming' | 'completed' | 'failed' | 'cancelled';
export type Generation = { id: string; conversationId: string; userMessageId: string; model: string; temperature: number; status: GenerationStatus; content: string; promptTokens: number | null; completionTokens: number | null; errorCode: string | null; startedAt: Date; finishedAt: Date | null };
export type GenerationRepository = { insert(generation: Generation): void; update(generation: Generation): void; findById(id: string): Generation | null };
export type AssistantMessageRepository = { insert(message: { id: string; conversationId: string; generationId: string; content: string; sequence: number; createdAt: Date }): void };
export type ConversationSummary = { id: string; workspaceId: string; title: string; status: 'active' | 'archived'; updatedAt: Date };
export type HistoryRepository = { list(workspaceId: string, userId: string, input: { limit: number; offset: number; includeArchived: boolean }): ConversationSummary[]; messages(conversationId: string, userId: string): Array<{ id: string; content: string; sequence: number; createdAt: Date }> };

export class ConversationHistoryService {
  constructor(private readonly repository: HistoryRepository) {}
  list(workspaceId: string, userId: string, limit = 20, offset = 0, includeArchived = false): ConversationSummary[] {
    return this.repository.list(workspaceId, userId, { limit: Math.min(Math.max(limit, 1), 100), offset: Math.max(offset, 0), includeArchived });
  }
  messages(conversationId: string, userId: string) { return this.repository.messages(conversationId, userId).sort((left, right) => left.sequence - right.sequence); }
}

export class InvalidGenerationTransitionError extends Error { constructor() { super('Invalid generation state transition'); this.name = 'InvalidGenerationTransitionError'; } }
export class GenerationPersistenceError extends Error { constructor() { super('Generation result could not be persisted'); this.name = 'GenerationPersistenceError'; } }

export class GenerationService {
  constructor(private readonly dependencies: { generations: GenerationRepository; messages: AssistantMessageRepository; idGenerator?: () => string }) {}
  create(input: { conversationId: string; userMessageId: string; model: string; temperature: number }): Generation {
    const generation: Generation = { id: (this.dependencies.idGenerator ?? randomUUID)(), ...input, status: 'pending', content: '', promptTokens: null, completionTokens: null, errorCode: null, startedAt: new Date(), finishedAt: null };
    this.dependencies.generations.insert(generation);
    return generation;
  }
  start(id: string): Generation { return this.transition(id, 'streaming'); }
  append(id: string, content: string): Generation { const generation = this.required(id); if (!['streaming', 'pending'].includes(generation.status)) throw new InvalidGenerationTransitionError(); generation.content += content; this.dependencies.generations.update(generation); return generation; }
  complete(id: string, metadata: { promptTokens?: number; completionTokens?: number; sequence: number }): Generation {
    const generation = this.required(id);
    if (!['streaming', 'pending'].includes(generation.status)) throw new InvalidGenerationTransitionError();
    try {
      this.dependencies.messages.insert({ id: (this.dependencies.idGenerator ?? randomUUID)(), conversationId: generation.conversationId, generationId: generation.id, content: generation.content, sequence: metadata.sequence, createdAt: new Date() });
      generation.promptTokens = metadata.promptTokens ?? null; generation.completionTokens = metadata.completionTokens ?? null; generation.status = 'completed'; generation.finishedAt = new Date(); this.dependencies.generations.update(generation); return generation;
    } catch { generation.status = 'failed'; generation.errorCode = 'PERSISTENCE_FAILURE'; generation.finishedAt = new Date(); this.dependencies.generations.update(generation); throw new GenerationPersistenceError(); }
  }
  fail(id: string, errorCode = 'PROVIDER_FAILURE'): Generation { const generation = this.required(id); if (['completed', 'failed', 'cancelled'].includes(generation.status)) throw new InvalidGenerationTransitionError(); generation.status = 'failed'; generation.errorCode = errorCode; generation.finishedAt = new Date(); this.dependencies.generations.update(generation); return generation; }
  cancel(id: string): Generation { const generation = this.required(id); if (generation.status === 'cancelled') return generation; if (['completed', 'failed'].includes(generation.status)) throw new InvalidGenerationTransitionError(); generation.status = 'cancelled'; generation.errorCode = 'CANCELLED_BY_USER'; generation.finishedAt = new Date(); this.dependencies.generations.update(generation); return generation; }
  private transition(id: string, status: 'streaming'): Generation { const generation = this.required(id); if (generation.status !== 'pending') throw new InvalidGenerationTransitionError(); generation.status = status; this.dependencies.generations.update(generation); return generation; }
  private required(id: string): Generation { const generation = this.dependencies.generations.findById(id); if (!generation) throw new Error('Generation not found'); return generation; }
}

export type RegenerationSource = { conversationId: string; userMessageId: string; model: string; temperature: number; conversationActive: boolean };
export class RegenerationNotAllowedError extends Error { constructor() { super('Conversation cannot be regenerated'); this.name = 'RegenerationNotAllowedError'; } }
export class RegenerationService {
  constructor(private readonly generations: GenerationService) {}
  regenerate(source: RegenerationSource): Generation {
    if (!source.conversationActive || !source.userMessageId) throw new RegenerationNotAllowedError();
    return this.generations.create({ conversationId: source.conversationId, userMessageId: source.userMessageId, model: source.model, temperature: source.temperature });
  }
}
