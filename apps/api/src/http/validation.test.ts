import { describe, expect, it } from 'vitest';
import { loginUserSchema, parseBody, registerUserSchema } from './validation.js';

describe('HTTP validation schemas', () => {
  it('normalizes a valid registration payload', () => {
    expect(parseBody(registerUserSchema, {
      name: '  Isaddora  ',
      email: ' ISADDORA@example.com ',
      password: 'strong-password',
      passwordConfirmation: 'strong-password',
    })).toMatchObject({ name: 'Isaddora', email: 'isaddora@example.com' });
  });

  it('rejects a registration payload with mismatched passwords', () => {
    expect(() => parseBody(registerUserSchema, {
      name: 'Isaddora', email: 'isaddora@example.com', password: 'strong-password', passwordConfirmation: 'different',
    })).toThrow();
  });

  it('rejects malformed login payloads', () => {
    expect(() => parseBody(loginUserSchema, { email: 'invalid', password: '' })).toThrow();
  });
});
