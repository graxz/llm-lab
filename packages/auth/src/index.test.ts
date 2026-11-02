import { describe, expect, it } from 'vitest';
import { EmailAlreadyRegisteredError, InvalidRegistrationInputError, PasswordHasher, RegisterUserUseCase } from './index.js';

function setup() {
  const users = new Map<string, any>();
  const workspaces = new Map<string, any>();
  const useCase = new RegisterUserUseCase({
    users: {
      findByEmail: (email) => users.get(email) ?? null,
      insert: (user) => users.set(user.email, user),
    },
    workspaces: {
      insert: (workspace) => workspaces.set(workspace.id, workspace),
    },
    transaction: (operation) => operation(),
    passwordHasher: new PasswordHasher(),
    idGenerator: (() => {
      let count = 0;
      return () => `id-${++count}`;
    })(),
  });

  return { useCase, users, workspaces };
}

describe('RegisterUserUseCase', () => {
  it('registers a user and creates the initial workspace without exposing the password', async () => {
    const { useCase, users, workspaces } = setup();

    const result = await useCase.execute({
      name: ' Isaddora ',
      email: ' ISADDORA@example.com ',
      password: 'strong-password',
      passwordConfirmation: 'strong-password',
    });

    expect(result.user.email).toBe('isaddora@example.com');
    expect(result.user.name).toBe('Isaddora');
    expect(result.user).not.toHaveProperty('password');
    expect(result.user).not.toHaveProperty('passwordHash');
    expect(users.get('isaddora@example.com').passwordHash).not.toBe('strong-password');
    expect(workspaces.size).toBe(1);
  });

  it('rejects a duplicated email', async () => {
    const { useCase } = setup();
    await useCase.execute({ name: 'A', email: 'a@example.com', password: '12345678', passwordConfirmation: '12345678' });

    await expect(useCase.execute({ name: 'B', email: 'A@EXAMPLE.COM', password: '12345678', passwordConfirmation: '12345678' }))
      .rejects.toBeInstanceOf(EmailAlreadyRegisteredError);
  });

  it('rejects invalid password confirmation', async () => {
    const { useCase } = setup();

    await expect(useCase.execute({ name: 'A', email: 'a@example.com', password: '12345678', passwordConfirmation: 'different' }))
      .rejects.toBeInstanceOf(InvalidRegistrationInputError);
  });
});
