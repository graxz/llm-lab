import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import Fastify from 'fastify';
import { AppError } from '@llm-lab/domain';
import {
  GetAuthenticatedUserUseCase,
  LoginUserUseCase,
  LogoutUserUseCase,
  PasswordHasher,
  RegisterUserUseCase,
} from '@llm-lab/auth';
import {
  createDatabase,
  createSessionRepository,
  createUserRegistrationTransaction,
  createUserRepository,
  createWorkspaceRepository,
} from '@llm-lab/database';

import { registerRoutes } from './routes/index.js';

export function buildApp() {
  const app = Fastify({ logger: true });

  app.register(cors, {
    origin: 'http://localhost:5173',
    credentials: true,
  });
  app.register(cookie);

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({
        code: error.code,
        message: error.message,
        ...(error.details ? { details: error.details } : {}),
      });
    }

    request.log.error(error);
    return reply.code(500).send({ code: 'INTERNAL_ERROR', message: 'Unexpected internal error' });
  });

  const database = createDatabase();
  const users = createUserRepository(database);
  const workspaces = createWorkspaceRepository(database);
  const sessions = createSessionRepository(database);
  const passwordHasher = new PasswordHasher();
  const registerUser = new RegisterUserUseCase({
    users,
    workspaces,
    transaction: createUserRegistrationTransaction(database),
    passwordHasher,
  });
  const loginUser = new LoginUserUseCase({ users, sessions, passwordHasher });
  const logoutUser = new LogoutUserUseCase(sessions);
  const getAuthenticatedUser = new GetAuthenticatedUserUseCase({ users, sessions });

  app.addHook('onClose', async () => {
    database.close();
  });

  registerRoutes(app, { registerUser, loginUser, logoutUser, getAuthenticatedUser });
  return app;
}
