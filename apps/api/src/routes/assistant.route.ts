import type { FastifyInstance } from 'fastify';
import { CreateAssistantUseCase, GetAuthenticatedUserUseCase, SessionNotFoundError } from '@llm-lab/auth';

import { parseBody, createAssistantSchema } from '../http/validation.js';
import { SESSION_COOKIE } from './auth.route.js';

type AssistantRouteDependencies = { createAssistant: CreateAssistantUseCase; getAuthenticatedUser: GetAuthenticatedUserUseCase };

export function registerAssistantRoutes(app: FastifyInstance, dependencies: AssistantRouteDependencies): void {
  app.post('/assistants', async (request, reply) => {
    const sessionToken = request.cookies[SESSION_COOKIE];
    if (!sessionToken) throw new SessionNotFoundError();
    const user = dependencies.getAuthenticatedUser.execute(sessionToken);
    const assistant = dependencies.createAssistant.execute(user.id, parseBody(createAssistantSchema, request.body));
    return reply.code(201).send({ assistant });
  });
}
