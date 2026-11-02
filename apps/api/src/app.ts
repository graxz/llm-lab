import cors from '@fastify/cors';
import Fastify from 'fastify';

import { registerRoutes } from './routes/index.js';

export function buildApp() {
    const app = Fastify({
        logger: true,
    });

    app.register(cors, {
        origin: "http://localhost:5173",
    });

    registerRoutes(app);

    return app;
}
