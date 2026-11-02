import type { FastifyInstance } from 'fastify';
import {
  GetAuthenticatedUserUseCase,
  LoginUserUseCase,
  LogoutUserUseCase,
  RegisterUserUseCase,
  CreateAssistantUseCase,
  ManageAssistantUseCase,
  type WorkspaceRepository,
} from '@llm-lab/auth';

import { registerAuthRoutes } from './auth.route.js';
import { registerHealthRoutes } from './health.route.js';
import { registerWorkspaceRoutes } from './workspace.route.js';
import { registerAssistantRoutes } from './assistant.route.js';

export type RouteDependencies = {
  registerUser: RegisterUserUseCase;
  loginUser: LoginUserUseCase;
  logoutUser: LogoutUserUseCase;
  getAuthenticatedUser: GetAuthenticatedUserUseCase;
  workspaces: WorkspaceRepository;
  createAssistant: CreateAssistantUseCase;
  manageAssistant: ManageAssistantUseCase;
};

export function registerRoutes(app: FastifyInstance, dependencies: RouteDependencies): void {
  registerHealthRoutes(app);
  registerAuthRoutes(app, dependencies);
  registerWorkspaceRoutes(app, dependencies);
  registerAssistantRoutes(app, dependencies);
}
