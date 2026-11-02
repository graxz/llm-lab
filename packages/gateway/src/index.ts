import { randomUUID } from 'node:crypto';

export type GatewayMessage = { role: 'system' | 'user' | 'assistant'; content: string };
export type GenerationRequest = { generationId?: string; messages: GatewayMessage[]; model: string; temperature: number; maxOutputTokens: number; stream?: boolean };
export type ProviderRequest = Omit<GenerationRequest, 'generationId'> & { generationId: string };
export type ProviderResult = { content: string; model?: string; promptTokens?: number; completionTokens?: number };
export type GenerationResult = ProviderResult & { generationId: string; model: string; usage: { promptTokens: number | null; completionTokens: number | null } };
export type ModelAdapter = { generate(request: ProviderRequest, signal: AbortSignal): Promise<ProviderResult> };

export class GatewayValidationError extends Error { statusCode = 400; code = 'INVALID_GENERATION_REQUEST'; constructor(message: string) { super(message); this.name = 'GatewayValidationError'; } }
export class GatewayTimeoutError extends Error { statusCode = 408; code = 'MODEL_TIMEOUT'; constructor() { super('Model request timed out'); this.name = 'GatewayTimeoutError'; } }
export class GatewayRateLimitError extends Error { statusCode = 429; code = 'PROVIDER_RATE_LIMIT'; constructor() { super('Provider rate limit exceeded'); this.name = 'GatewayRateLimitError'; } }
export class GatewayProviderError extends Error { statusCode = 502; code = 'PROVIDER_FAILURE'; constructor() { super('Model provider failed'); this.name = 'GatewayProviderError'; } }

const ENABLED_MODELS = new Set(['gpt-4o-mini', 'gpt-4o']);

export class AiGateway {
  constructor(private readonly dependencies: { adapter: ModelAdapter; timeoutMs?: number; enabledModels?: ReadonlySet<string> }) {}

  async generate(request: GenerationRequest): Promise<GenerationResult> {
    this.validate(request);
    const generationId = request.generationId ?? randomUUID();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.dependencies.timeoutMs ?? 30000);
    try {
      const result = await this.withTimeout(this.dependencies.adapter.generate({ ...request, generationId }, controller.signal), controller.signal);
      return { ...result, generationId, model: result.model ?? request.model, usage: { promptTokens: result.promptTokens ?? null, completionTokens: result.completionTokens ?? null } };
    } catch (error) {
      if (error instanceof GatewayTimeoutError) throw error;
      if (error instanceof GatewayRateLimitError || error instanceof GatewayProviderError) throw error;
      if (error instanceof Error && error.name === 'AbortError') throw new GatewayTimeoutError();
      throw new GatewayProviderError();
    } finally { clearTimeout(timeout); }
  }

  private validate(request: GenerationRequest): void {
    const models = this.dependencies.enabledModels ?? ENABLED_MODELS;
    if (!models.has(request.model)) throw new GatewayValidationError('Model is not enabled');
    if (request.messages.length === 0 || request.maxOutputTokens < 1 || request.maxOutputTokens > 32768) throw new GatewayValidationError('Generation parameters are invalid');
    if (request.temperature < 0 || request.temperature > 2) throw new GatewayValidationError('Temperature must be between 0 and 2');
  }

  private async withTimeout<T>(operation: Promise<T>, signal: AbortSignal): Promise<T> {
    if (signal.aborted) throw new GatewayTimeoutError();
    return new Promise<T>((resolve, reject) => {
      const onAbort = () => reject(new GatewayTimeoutError());
      signal.addEventListener('abort', onAbort, { once: true });
      operation.then((value) => { signal.removeEventListener('abort', onAbort); resolve(value); }, (error) => { signal.removeEventListener('abort', onAbort); reject(error); });
    });
  }
}
