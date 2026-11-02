import { describe, expect, it } from 'vitest';
import { publicError, safePublicError } from './public-errors.js';

describe('public errors', () => {
  it('maps retryable provider failures without exposing technical details', () => {
    const result = safePublicError({ code: 'PROVIDER_FAILURE', message: 'secret key=abc stack trace' });
    expect(result).toEqual({ category: 'provider', code: 'PROVIDER_FAILURE', statusCode: 502, message: 'A geração não foi concluída pelo provedor.', retryable: true });
    expect(JSON.stringify(result)).not.toContain('secret');
  });
  it('uses a safe generic descriptor for unknown errors', () => {
    expect(publicError('UNKNOWN')).toMatchObject({ code: 'INTERNAL_ERROR', statusCode: 500, retryable: false });
  });
});
