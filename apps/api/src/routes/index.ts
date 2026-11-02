import type { FastifyInstance } from 'fastify';
import {
  GetAuthenticatedUserUseCase,
  LoginUserUseCase,
  LogoutUserUseCase,
  RegisterUserUseCase,
} from '@llm-lab/auth';

import { registerAuthRoutes } from './auth.route.js';
import { registerHealthRoutes } from './health.route.js';

export type RouteDependencies = {
  registerUser: RegisterUserUseCase;
  loginUser: LoginUserUseCase;
  logoutUser: LogoutUserUseCase;
  getAuthenticatedUser: GetAuthenticatedUserUseCase;
};

export function registerRoutes(app: FastifyInstance, dependencies: RouteDependencies): void {
  registerHealthRoutes(app);
  registerAuthRoutes(app, dependencies);
}
