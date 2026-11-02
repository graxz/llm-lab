import type { FastifyInstance } from 'fastify';
import { CreateAssistantUseCase, GetAuthenticatedUserUseCase, ManageAssistantUseCase, SessionNotFoundError } from '@llm-lab/auth';

import { createAssistantSchema, parseBody } from '../http/validation.js';
import { SESSION_COOKIE } from './auth.route.js';

type AssistantRouteDependencies = { createAssistant: CreateAssistantUseCase; manageAssistant: ManageAssistantUseCase; getAuthenticatedUser: GetAuthenticatedUserUseCase };

export function registerAssistantRoutes(app: FastifyInstance, dependencies: AssistantRouteDependencies): void {
  app.post('/assistants', async (request, reply) => {
    const user = authenticatedUser(request, dependencies);
    const assistant = dependencies.createAssistant.execute(user.id, parseBody(createAssistantSchema, request.body));
    return reply.code(201).send({ assistant });
  });
  app.get<{ Querystring: { workspaceId?: string } }>('/assistants', async (request, reply) => {
    authenticatedUser(request, dependencies);
    return reply.code(200).send({ assistants: request.query.workspaceId ? dependencies.manageAssistant.list(request.query.workspaceId) : [] });
  });
  app.patch<{ Params: { assistantId: string }; Body: unknown }>('/assistants/:assistantId', async (request, reply) => {
    authenticatedUser(request, dependencies);
    const body = parseBody(createAssistantSchema.partial(), request.body);
    const workspaceId = request.headers['x-workspace-id'];
    if (typeof workspaceId !== 'string') return reply.code(400).send({ code: 'VALIDATION_ERROR', message: 'x-workspace-id is required' });
    return reply.code(200).send({ assistant: dependencies.manageAssistant.update(request.params.assistantId, workspaceId, body) });
  });
  app.delete<{ Params: { assistantId: string }; Querystring: { workspaceId?: string } }>('/assistants/:assistantId', async (request, reply) => {
    authenticatedUser(request, dependencies);
    if (!request.query.workspaceId) return reply.code(400).send({ code: 'VALIDATION_ERROR', message: 'workspaceId is required' });
    dependencies.manageAssistant.remove(request.params.assistantId, request.query.workspaceId);
    return reply.code(204).send();
  });
}

function authenticatedUser(request: { cookies: Record<string, string | undefined> }, dependencies: AssistantRouteDependencies) {
  const sessionToken = request.cookies[SESSION_COOKIE];
  if (!sessionToken) throw new SessionNotFoundError();
  return dependencies.getAuthenticatedUser.execute(sessionToken);
}
