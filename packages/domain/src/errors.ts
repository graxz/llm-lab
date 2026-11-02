export type ValidationIssue = {
  field: string;
  code: string;
  message: string;
};

export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(issues: ValidationIssue[]) {
    super('VALIDATION_ERROR', 400, 'Request validation failed', { issues });
    this.name = 'ValidationError';
  }
}
