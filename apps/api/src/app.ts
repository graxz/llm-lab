import cors from '@fastify/cors';
import Fastify from 'fastify';
import { PasswordHasher, RegisterUserUseCase } from '@llm-lab/auth';
import {
    createDatabase,
    createUserRegistrationTransaction,
    createUserRepository,
    createWorkspaceRepository,
} from '@llm-lab/database';

import { registerRoutes } from './routes/index.js';

export function buildApp() {
    const app = Fastify({
        logger: true,
    });

    app.register(cors, {
        origin: "http://localhost:5173",
    });

    const database = createDatabase();
    const users = createUserRepository(database);
    const workspaces = createWorkspaceRepository(database);
    const registerUser = new RegisterUserUseCase({
        users,
        workspaces,
        transaction: createUserRegistrationTransaction(database),
        passwordHasher: new PasswordHasher(),
    });

    app.addHook('onClose', async () => {
        database.close();
    });

    registerRoutes(app, registerUser);

    return app;
}
