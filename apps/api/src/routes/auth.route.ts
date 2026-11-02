import type { FastifyInstance } from 'fastify';
import {
  EmailAlreadyRegisteredError,
  InvalidRegistrationInputError,
  type RegisterUserInput,
  type RegisterUserOutput,
  RegisterUserUseCase,
} from '@llm-lab/auth';

export function registerAuthRoutes(app: FastifyInstance, registerUser: RegisterUserUseCase): void {
  app.post<{ Body: RegisterUserInput; Reply: RegisterUserOutput | { code: string; message: string } }>(
    '/auth/register',
    async (request, reply) => {
      try {
        const result = await registerUser.execute(request.body);
        return reply.code(201).send(result);
      } catch (error) {
        if (error instanceof InvalidRegistrationInputError) {
          return reply.code(400).send({ code: 'INVALID_REGISTRATION_INPUT', message: error.message });
        }

        if (error instanceof EmailAlreadyRegisteredError) {
          return reply.code(409).send({ code: 'EMAIL_ALREADY_REGISTERED', message: 'Email is already registered' });
        }

        request.log.error(error);
        return reply.code(500).send({ code: 'INTERNAL_ERROR', message: 'Unable to register user' });
      }
    },
  );
}
