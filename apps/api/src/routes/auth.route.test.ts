import Fastify from 'fastify';
import { describe, expect, it } from 'vitest';
import { PasswordHasher, RegisterUserUseCase } from '@llm-lab/auth';
import { registerAuthRoutes } from './auth.route.js';

describe('POST /auth/register', () => {
  function createTestApp() {
    const users = new Map<string, any>();
    const workspaces = new Map<string, any>();
    const app = Fastify();
    const registerUser = new RegisterUserUseCase({
      users: {
        findByEmail: (email) => users.get(email) ?? null,
        insert: (user) => users.set(user.email, user),
      },
      workspaces: {
        insert: (workspace) => workspaces.set(workspace.id, workspace),
      },
      transaction: (operation) => operation(),
      passwordHasher: new PasswordHasher(),
    });

    registerAuthRoutes(app, registerUser);
    return app;
  }

  it('returns the user and initial workspace without a password hash', async () => {
    const app = createTestApp();
    const response = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        name: 'Isaddora',
        email: 'isaddora@example.com',
        password: 'strong-password',
        passwordConfirmation: 'strong-password',
      },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject({
      user: { name: 'Isaddora', email: 'isaddora@example.com', status: 'active' },
      workspace: { userId: expect.any(String) },
    });
    expect(response.json().user).not.toHaveProperty('passwordHash');
  });

  it('returns 409 for a duplicated email', async () => {
    const app = createTestApp();
    const payload = { name: 'Isaddora', email: 'isaddora@example.com', password: 'strong-password', passwordConfirmation: 'strong-password' };

    await app.inject({ method: 'POST', url: '/auth/register', payload });
    const response = await app.inject({ method: 'POST', url: '/auth/register', payload });

    expect(response.statusCode).toBe(409);
  });
});
