import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import Fastify from 'fastify';
import {
  GetAuthenticatedUserUseCase,
  LoginUserUseCase,
  LogoutUserUseCase,
  PasswordHasher,
  RegisterUserUseCase,
  CreateAssistantUseCase,
  ManageAssistantUseCase,
  CreateConversationUseCase,
} from '@llm-lab/auth';
import {
  createDatabase,
  createSessionRepository,
  createUserRegistrationTransaction,
  createUserRepository,
  createWorkspaceRepository,
  createAssistantRepository,
  createConversationRepository,
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
  const assistants = createAssistantRepository(database);
  const conversations = createConversationRepository(database);
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
  const createAssistant = new CreateAssistantUseCase({ assistants, workspaces });
  const manageAssistant = new ManageAssistantUseCase(assistants);
  const createConversation = new CreateConversationUseCase({ conversations, assistants, workspaces });

  app.addHook('onClose', async () => {
    database.close();
  });

  registerRoutes(app, { registerUser, loginUser, logoutUser, getAuthenticatedUser, workspaces, createAssistant, manageAssistant, createConversation });
  return app;
}
