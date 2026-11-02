import { z, type ZodType } from 'zod';

export const registerUserSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required'),
    email: z.string().trim().toLowerCase().email('Email must be valid'),
    password: z.string().min(8, 'Password must have at least 8 characters'),
    passwordConfirmation: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((input) => input.password === input.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: 'Password confirmation does not match',
  });

export const loginUserSchema = z.object({
  email: z.string().trim().toLowerCase().email('Email must be valid'),
  password: z.string().min(1, 'Password is required'),
});

export const createAssistantSchema = z.object({
  workspaceId: z.string().trim().min(1),
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().max(500).optional(),
  systemInstructions: z.string().trim().min(1).max(12000),
  model: z.enum(['gpt-4o-mini', 'gpt-4o']),
  temperature: z.number().min(0).max(2),
});

export function parseBody<TSchema extends ZodType>(schema: TSchema, body: unknown): TSchema['_output'] {
  return schema.parse(body);
}

export function validationDetails(error: z.ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || 'body',
    code: issue.code,
    message: issue.message,
  }));
}
