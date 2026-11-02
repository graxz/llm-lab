export type PublicErrorCategory = 'validation' | 'auth' | 'not_found' | 'forbidden' | 'model' | 'timeout' | 'rate_limit' | 'provider' | 'internal';
export type PublicErrorDescriptor = { category: PublicErrorCategory; code: string; statusCode: number; message: string; retryable: boolean };

const descriptors: Record<string, PublicErrorDescriptor> = {
  VALIDATION_ERROR: { category: 'validation', code: 'VALIDATION_ERROR', statusCode: 400, message: 'Revise os dados enviados.', retryable: false },
  UNAUTHENTICATED: { category: 'auth', code: 'UNAUTHENTICATED', statusCode: 401, message: 'Sua sessão expirou. Entre novamente.', retryable: true },
  FORBIDDEN: { category: 'forbidden', code: 'FORBIDDEN', statusCode: 403, message: 'Você não tem permissão para esta ação.', retryable: false },
  MODEL_NOT_ALLOWED: { category: 'model', code: 'MODEL_NOT_ALLOWED', statusCode: 400, message: 'O modelo selecionado não está disponível.', retryable: false },
  MODEL_TIMEOUT: { category: 'timeout', code: 'MODEL_TIMEOUT', statusCode: 408, message: 'A geração demorou demais. Você pode tentar novamente.', retryable: true },
  PROVIDER_RATE_LIMIT: { category: 'rate_limit', code: 'PROVIDER_RATE_LIMIT', statusCode: 429, message: 'O limite temporário foi atingido. Tente novamente em instantes.', retryable: true },
  PROVIDER_FAILURE: { category: 'provider', code: 'PROVIDER_FAILURE', statusCode: 502, message: 'A geração não foi concluída pelo provedor.', retryable: true },
  INTERNAL_ERROR: { category: 'internal', code: 'INTERNAL_ERROR', statusCode: 500, message: 'Ocorreu um erro inesperado.', retryable: false },
};

export function publicError(code: string): PublicErrorDescriptor { return descriptors[code] ?? descriptors.INTERNAL_ERROR; }
export function safePublicError(error: unknown): PublicErrorDescriptor { return error && typeof error === 'object' && 'code' in error ? publicError(String(error.code)) : publicError('INTERNAL_ERROR'); }
