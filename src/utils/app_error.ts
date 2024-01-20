interface AppErrorParams {
  name: string;
  statusCode: number;
  isOperational: boolean;
  message?: string;
  stack?: string;
}

interface InternalErrorParams {
  isOperational: boolean;
  message?: string;
  stack?: string;
}

class AppError extends Error {
  public name: string;
  public statusCode: number;
  public isOperational: boolean;

  constructor(params: AppErrorParams) {
    super(params.message);
    this.name = params.name;
    this.statusCode = params.statusCode;
    this.isOperational = params.isOperational;

    if (params.stack) {
      this.stack = params.stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static fromError(error: Error): AppError {
    return new AppError({
      name: error.name,
      message: error.message,
      isOperational: false,
      statusCode: 500,
      stack: error.stack,
    });
  }

  static internal(params: InternalErrorParams): AppError {
    return new AppError({
      name: 'Internal Server Error',
      message: params.message,
      isOperational: params.isOperational,
      statusCode: 500,
      stack: new Error().stack,
    });
  }

  static badRequest(message?: string): AppError {
    return new AppError({
      name: 'Bad Request',
      message: message,
      isOperational: true,
      statusCode: 400,
    });
  }

  static unauthorized(message?: string): AppError {
    return new AppError({
      name: 'Unauthorized',
      message: message,
      isOperational: true,
      statusCode: 401,
    });
  }

  static forbidden(message?: string): AppError {
    return new AppError({
      name: 'Forbidden',
      message: message,
      isOperational: true,
      statusCode: 403,
    });
  }

  static notFound(message?: string): AppError {
    return new AppError({
      name: 'Not Found',
      message: message,
      isOperational: true,
      statusCode: 404,
    });
  }

  static external(message?: string): AppError {
    return new AppError({
      name: 'External',
      message: message ?? 'An external service provider is down',
      isOperational: true,
      statusCode: 424,
    });
  }
}

export default AppError;
