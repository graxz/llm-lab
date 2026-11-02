import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import Fastify from 'fastify';
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
import { registerErrorHandler } from './http/error-handler.js';

export function buildApp() {
  const app = Fastify({ logger: true });

  app.register(cors, {
    origin: 'http://localhost:5173',
    credentials: true,
  });
  app.register(cookie);

  registerErrorHandler(app);

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
