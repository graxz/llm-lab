import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import {
  GetAuthenticatedUserUseCase,
  SessionNotFoundError,
  WorkspaceAccessDeniedError,
  WorkspaceNotFoundError,
  type WorkspaceRepository,
} from '@llm-lab/auth';

import { SESSION_COOKIE } from './auth.route.js';

export const WORKSPACE_COOKIE = 'llm_lab_workspace';

const workspaceParamsSchema = z.object({ workspaceId: z.string().trim().min(1) });

type WorkspaceRouteDependencies = {
  getAuthenticatedUser: GetAuthenticatedUserUseCase;
  workspaces: WorkspaceRepository;
};

export function registerWorkspaceRoutes(app: FastifyInstance, dependencies: WorkspaceRouteDependencies): void {
  app.get('/workspaces', async (request, reply) => {
    const user = authenticatedUser(request, dependencies);
    return reply.code(200).send({ workspaces: dependencies.workspaces.findAllByUserId(user.id) });
  });

  app.get('/workspaces/default', async (request, reply) => {
    const user = authenticatedUser(request, dependencies);
    const workspace = dependencies.workspaces.findDefaultByUserId(user.id);
    if (!workspace) throw new WorkspaceNotFoundError();

    return reply.code(200).send({ workspace });
  });

  app.post<{ Params: { workspaceId: string } }>('/workspaces/:workspaceId/select', async (request, reply) => {
    const user = authenticatedUser(request, dependencies);
    const { workspaceId } = workspaceParamsSchema.parse(request.params);
    const workspace = dependencies.workspaces.findByIdForUser(workspaceId, user.id);
    if (!workspace) throw new WorkspaceAccessDeniedError();

    return reply
      .setCookie(WORKSPACE_COOKIE, workspace.id, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' })
      .code(200)
      .send({ workspace });
  });
}

function authenticatedUser(request: { cookies: Record<string, string | undefined> }, dependencies: WorkspaceRouteDependencies) {
  const sessionToken = request.cookies[SESSION_COOKIE];
  if (!sessionToken) throw new SessionNotFoundError();
  return dependencies.getAuthenticatedUser.execute(sessionToken);
}
