import type { FastifyInstance } from 'fastify';
import { SendMessageUseCase, GetAuthenticatedUserUseCase, SessionNotFoundError } from '@llm-lab/auth';
import { z } from 'zod';
import { parseBody } from '../http/validation.js';
import { SESSION_COOKIE } from './auth.route.js';

const sendMessageSchema = z.object({ content: z.string(), idempotencyKey: z.string().trim().min(1).max(200) });
type Dependencies = { sendMessage: SendMessageUseCase; getAuthenticatedUser: GetAuthenticatedUserUseCase };

export function registerMessageRoutes(app: FastifyInstance, dependencies: Dependencies): void {
  app.post<{ Params: { conversationId: string }; Body: unknown }>('/conversations/:conversationId/messages', async (request, reply) => {
    const sessionToken = request.cookies[SESSION_COOKIE];
    if (!sessionToken) throw new SessionNotFoundError();
    const user = dependencies.getAuthenticatedUser.execute(sessionToken);
    const body = parseBody(sendMessageSchema, request.body);
    const message = dependencies.sendMessage.execute(user.id, request.params.conversationId, body.content, body.idempotencyKey);
    return reply.code(201).send({ message });
  });
}
