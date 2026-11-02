export type ModelDefinition = { id: string; label: string; enabled: boolean; contextWindow: number; maxOutputTokens: number };
export class ModelNotAllowedError extends Error { statusCode = 400; code = 'MODEL_NOT_ALLOWED'; constructor() { super('Selected model is not available'); this.name = 'ModelNotAllowedError'; } }
export class ModelRegistry {
  constructor(private readonly models: readonly ModelDefinition[]) {}
  listEnabled(): ModelDefinition[] { return this.models.filter((model) => model.enabled).map((model) => ({ ...model })); }
  requireEnabled(id: string): ModelDefinition { const model = this.models.find((candidate) => candidate.id === id && candidate.enabled); if (!model) throw new ModelNotAllowedError(); return { ...model }; }
}

export const DEFAULT_MODELS: readonly ModelDefinition[] = [
  { id: 'gpt-4o-mini', label: 'GPT-4o mini', enabled: true, contextWindow: 128000, maxOutputTokens: 16384 },
  { id: 'gpt-4o', label: 'GPT-4o', enabled: true, contextWindow: 128000, maxOutputTokens: 16384 },
];
