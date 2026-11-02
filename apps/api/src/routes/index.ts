import type { FastifyInstance } from 'fastify';
import { RegisterUserUseCase } from '@llm-lab/auth';

import { registerAuthRoutes } from './auth.route.js';
import { registerHealthRoutes } from './health.route.js';

export function registerRoutes(app: FastifyInstance, registerUser: RegisterUserUseCase): void {
    registerHealthRoutes(app);
    registerAuthRoutes(app, registerUser);
}
