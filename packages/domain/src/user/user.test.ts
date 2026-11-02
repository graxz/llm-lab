import { describe, expect, it } from 'vitest';
import { User } from './user.js';

describe('User', () => {
  it('normalizes valid user data', () => {
    const user = User.create({
      id: 'user-1',
      name: '  Isaddora  ',
      email: ' ISADDORA@example.com ',
      passwordHash: 'scrypt$hash',
    });

    expect(user.name).toBe('Isaddora');
    expect(user.email).toBe('isaddora@example.com');
    expect(user.isActive()).toBe(true);
  });

  it('rejects an invalid email', () => {
    expect(() => User.create({ id: 'user-1', name: 'A', email: 'invalid', passwordHash: 'hash' }))
      .toThrow('User email is invalid');
  });
});
