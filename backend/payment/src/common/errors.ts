import { ValidationError } from '@nestjs/common';

export enum StatusCode {
  SUCCESS = 'SUCCESS',
  DATABASE_CONNECTION_ERROR = 'DATABASE_CONNECTION_ERROR',
  HOST_NOT_AVAILABLE = 'HOST_NOT_AVAILABLE',
  INTERNAL_SYSTEM_ERROR = 'INTERNAL_SYSTEM_ERROR',
  API_INTEGRATION_ERROR = 'API_INTEGRATION_ERROR',
  API_OBSOLETE = 'API_OBSOLETE',
  FORBIDDEN = 'FORBIDDEN',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  BAD_USER_INPUT = 'BAD_USER_INPUT',
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE_RECORD = 'DUPLICATE_RECORD',
  REQUEST_TIMEOUT = 'REQUEST_TIMEOUT',
}

export class CommonError extends Error {
  public message!: string;
  public code!: string;
  public extensions?: Record<string, unknown>;

  constructor(
    message: string,
    code: string,
    extensions?: Record<string, unknown>,
  ) {
    super(message);
    this.message = message;
    this.code = code;
    this.extensions = {
      ...extensions,
      code,
    };
  }
}

export class DatabaseConnectionError extends CommonError {
  constructor(message: string, extensions?: Record<string, unknown>) {
    super(message, StatusCode.DATABASE_CONNECTION_ERROR, extensions);
  }
}

export class HostNotAvailable extends CommonError {
  constructor(message: string, extensions?: Record<string, unknown>) {
    super(message, StatusCode.HOST_NOT_AVAILABLE, extensions);
  }
}

export class InternalSystemError extends CommonError {
  constructor(message: string, extensions?: Record<string, unknown>) {
    super(message, StatusCode.INTERNAL_SYSTEM_ERROR, extensions);
  }
}

export class ApiIntegrationError extends CommonError {
  constructor(message: string, extensions?: Record<string, unknown>) {
    super(message, StatusCode.API_INTEGRATION_ERROR, extensions);
  }
}

export class ApiObsolete extends CommonError {
  constructor(message: string, extensions?: Record<string, unknown>) {
    super(message, StatusCode.API_OBSOLETE, extensions);
  }
}

export class ForbiddenError extends CommonError {
  constructor(message: string, extensions?: Record<string, unknown>) {
    super(message, StatusCode.FORBIDDEN, extensions);
  }
}

export class AuthenticationError extends CommonError {
  constructor(message: string, extensions?: Record<string, unknown>) {
    super(message, StatusCode.UNAUTHENTICATED, extensions);
  }
}

export class UserInputError extends CommonError {
  constructor(message: string, extensions?: Record<string, unknown>) {
    super(message, StatusCode.BAD_USER_INPUT, extensions);
  }
}

export class NotFoundError extends CommonError {
  constructor(message: string, extensions?: Record<string, unknown>) {
    super(message, StatusCode.NOT_FOUND, extensions);
  }
}

export class DuplicateError extends CommonError {
  constructor(message: string, extensions?: Record<string, unknown>) {
    super(message, StatusCode.DUPLICATE_RECORD, extensions);
  }
}

export class RequestTimeout extends CommonError {
  constructor(message: string, extensions?: Record<string, unknown>) {
    super(message, StatusCode.REQUEST_TIMEOUT, extensions);
  }
}

function concatErrorMessage(
  messages: string[],
  errs: ValidationError[],
): string {
  errs?.forEach((error) => {
    if (error.children && error.children?.length > 0) {
      concatErrorMessage(messages, error.children);
    }

    for (const validation in error.constraints) {
      messages.push(error.constraints[validation]);
    }
  });

  return messages?.join(', ');
}

export function formatValidationError(errs: ValidationError[]): void {
  const hasError: boolean = errs.length > 0;
  if (hasError) {
    throw new UserInputError(concatErrorMessage([], errs));
  }
}
