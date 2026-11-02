import Fastify from 'fastify';
import cookie from '@fastify/cookie';
import { describe, expect, it } from 'vitest';
import { GetAuthenticatedUserUseCase, LoginUserUseCase, LogoutUserUseCase, PasswordHasher, RegisterUserUseCase, type SessionInput, type UserSnapshotLike } from '@llm-lab/auth';
import { registerErrorHandler } from '../http/error-handler.js';
import { registerAuthRoutes } from './auth.route.js';

describe('authentication routes', () => {
  function createTestApp() {
    const users = new Map<string, UserSnapshotLike>();
    const sessions = new Map<string, SessionInput>();
    const userRepository = {
      findByEmail: (email: string) => users.get(email) ?? null,
      findById: (id: string) => [...users.values()].find((user) => user.id === id) ?? null,
      insert: (user: UserSnapshotLike) => users.set(user.email, user),
    };
    const sessionRepository = {
      insert: (session: SessionInput) => sessions.set(session.tokenHash, session),
      findByTokenHash: (hash: string) => sessions.get(hash) ?? null,
      deleteByTokenHash: (hash: string) => sessions.delete(hash),
    };
    const passwordHasher = new PasswordHasher();
    let sequence = 0;
    const app = Fastify();
    registerErrorHandler(app);
    const registerUser = new RegisterUserUseCase({ users: userRepository, workspaces: { insert: () => undefined }, transaction: (operation) => operation(), passwordHasher, idGenerator: () => `id-${++sequence}` });
    const loginUser = new LoginUserUseCase({ users: userRepository, sessions: sessionRepository, passwordHasher, tokenGenerator: () => 'session-token', idGenerator: () => `session-${++sequence}` });

    app.register(cookie);
    registerAuthRoutes(app, {
      registerUser,
      loginUser,
      logoutUser: new LogoutUserUseCase(sessionRepository),
      getAuthenticatedUser: new GetAuthenticatedUserUseCase({ users: userRepository, sessions: sessionRepository }),
    });
    return app;
  }

  it('registers a user and logs in with an HTTP-only cookie', async () => {
    const app = createTestApp();
    const payload = { name: 'Isaddora', email: 'isaddora@example.com', password: 'strong-password', passwordConfirmation: 'strong-password' };
    const registration = await app.inject({ method: 'POST', url: '/auth/register', payload });
    expect(registration.statusCode).toBe(201);

    const login = await app.inject({ method: 'POST', url: '/auth/login', payload: { email: payload.email, password: payload.password } });
    expect(login.statusCode).toBe(200);
    expect(login.headers['set-cookie']).toEqual(expect.stringContaining('llm_lab_session='));
    expect(login.json()).toEqual(expect.objectContaining({ user: expect.objectContaining({ email: payload.email }) }));
  });

  it('protects the current-user route and revokes the cookie on logout', async () => {
    const app = createTestApp();
    await app.inject({ method: 'POST', url: '/auth/register', payload: { name: 'A', email: 'a@example.com', password: '12345678', passwordConfirmation: '12345678' } });
    const login = await app.inject({ method: 'POST', url: '/auth/login', payload: { email: 'a@example.com', password: '12345678' } });
    const setCookie = login.headers['set-cookie'];
    const sessionCookie = (Array.isArray(setCookie) ? setCookie[0] : setCookie)?.split(';')[0];
    expect((await app.inject({ method: 'GET', url: '/auth/me' })).statusCode).toBe(401);
    expect((await app.inject({ method: 'GET', url: '/auth/me', headers: { cookie: sessionCookie } })).statusCode).toBe(200);
    expect((await app.inject({ method: 'POST', url: '/auth/logout', headers: { cookie: sessionCookie } })).statusCode).toBe(204);
    expect((await app.inject({ method: 'GET', url: '/auth/me', headers: { cookie: sessionCookie } })).statusCode).toBe(401);
  });

  it('returns field-level validation details without route conditionals', async () => {
    const response = await createTestApp().inject({ method: 'POST', url: '/auth/register', payload: { email: 'invalid', password: '' } });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      code: 'VALIDATION_ERROR',
      details: { issues: expect.arrayContaining([expect.objectContaining({ field: 'name' }), expect.objectContaining({ field: 'email' })]) },
    });
  });
});
