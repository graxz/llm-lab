import type { FastifyInstance } from 'fastify';
import { CreateConversationUseCase, GetAuthenticatedUserUseCase, SessionNotFoundError } from '@llm-lab/auth';
import { z } from 'zod';
import { SESSION_COOKIE } from './auth.route.js';
import { parseBody } from '../http/validation.js';

const createConversationSchema = z.object({ workspaceId: z.string().trim().min(1), assistantId: z.string().trim().min(1), title: z.string().trim().max(200).optional() });
type Dependencies = { createConversation: CreateConversationUseCase; getAuthenticatedUser: GetAuthenticatedUserUseCase };

export function registerConversationRoutes(app: FastifyInstance, dependencies: Dependencies): void {
  app.post<{ Body: unknown }>('/conversations', async (request, reply) => {
    const sessionToken = request.cookies[SESSION_COOKIE];
    if (!sessionToken) throw new SessionNotFoundError();
    const user = dependencies.getAuthenticatedUser.execute(sessionToken);
    const body = parseBody(createConversationSchema, request.body);
    const conversation = dependencies.createConversation.execute(user.id, body.workspaceId, body.assistantId, body.title);
    return reply.code(201).send({ conversation });
  });
}
