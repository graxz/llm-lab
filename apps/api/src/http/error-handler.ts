import type { FastifyInstance } from 'fastify';
import { AppError, safePublicError } from '@llm-lab/domain';
import { ZodError } from 'zod';

import { validationDetails } from './validation.js';

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      return reply.code(400).send({
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: { issues: validationDetails(error) },
      });
    }

    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({
        code: error.code,
        message: error.message,
        ...(error.details ? { details: error.details } : {}),
      });
    }

    request.log.error({ err: error }, 'Unhandled request error');
    const descriptor = safePublicError(error);
    return reply.code(descriptor.statusCode).send(descriptor);
  });
}
