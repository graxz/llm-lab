import type { FastifyInstance } from 'fastify';
import { GetAuthenticatedUserUseCase, SessionNotFoundError, WorkspaceNotFoundError, type WorkspaceRepository } from '@llm-lab/auth';

import { SESSION_COOKIE } from './auth.route.js';

type WorkspaceRouteDependencies = {
  getAuthenticatedUser: GetAuthenticatedUserUseCase;
  workspaces: WorkspaceRepository;
};

export function registerWorkspaceRoutes(app: FastifyInstance, dependencies: WorkspaceRouteDependencies): void {
  app.get('/workspaces/default', async (request, reply) => {
    const sessionToken = request.cookies[SESSION_COOKIE];
    if (!sessionToken) throw new SessionNotFoundError();

    const user = dependencies.getAuthenticatedUser.execute(sessionToken);
    const workspace = dependencies.workspaces.findDefaultByUserId(user.id);
    if (!workspace) throw new WorkspaceNotFoundError();

    return reply.code(200).send({ workspace });
  });
}
