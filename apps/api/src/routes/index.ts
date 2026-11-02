import type { FastifyInstance } from 'fastify';

import { registerHealthRoutes } from './health.route.js';

export function registerRoutes(app: FastifyInstance): void {
    registerHealthRoutes(app);
}