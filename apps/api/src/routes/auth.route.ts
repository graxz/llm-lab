import type { FastifyInstance } from 'fastify';
import {
  GetAuthenticatedUserUseCase,
  LoginUserUseCase,
  LogoutUserUseCase,
  RegisterUserUseCase,
  SessionNotFoundError,
  type LoginUserInput,
  type RegisterUserInput,
  type RegisterUserOutput,
} from '@llm-lab/auth';

export const SESSION_COOKIE = 'llm_lab_session';

type AuthRouteDependencies = {
  registerUser: RegisterUserUseCase;
  loginUser: LoginUserUseCase;
  logoutUser: LogoutUserUseCase;
  getAuthenticatedUser: GetAuthenticatedUserUseCase;
};

export function registerAuthRoutes(app: FastifyInstance, dependencies: AuthRouteDependencies): void {
  app.post<{ Body: RegisterUserInput; Reply: RegisterUserOutput | ErrorResponse }>('/auth/register', async (request, reply) => {
    return reply.code(201).send(await dependencies.registerUser.execute(request.body));
  });

  app.post<{ Body: LoginUserInput }>('/auth/login', async (request, reply) => {
    const result = await dependencies.loginUser.execute(request.body);
    reply.setCookie(SESSION_COOKIE, result.sessionToken, cookieOptions(result.expiresAt));
    return reply.code(200).send({ user: result.user, expiresAt: result.expiresAt });
  });

  app.post('/auth/logout', async (request, reply) => {
    const sessionToken = request.cookies[SESSION_COOKIE];
    if (sessionToken) dependencies.logoutUser.execute(sessionToken);
    return reply.clearCookie(SESSION_COOKIE, { path: '/' }).code(204).send();
  });

  app.get('/auth/me', async (request, reply) => {
    const sessionToken = request.cookies[SESSION_COOKIE];
    if (!sessionToken) return reply.code(401).send({ code: 'UNAUTHENTICATED', message: 'Authentication required' });

    return reply.code(200).send({ user: dependencies.getAuthenticatedUser.execute(sessionToken) });
  });
}

type ErrorResponse = { code: string; message: string; details?: unknown };

function cookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  };
}
