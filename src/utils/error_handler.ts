import { Response } from 'express';
import AppError from './app_error';
import Config from '../config';

class ErrorHandler {
  private logError(err: Error): void {
    var statusCode;
    if (err instanceof AppError) {
      statusCode = err.statusCode;
    }

    var errorObject;
    if (Config.node_env === 'development') {
      errorObject = {
        name: err.name,
        message: err.message,
        statusCode: statusCode,
        stack: err.stack,
      };
    } else {
      errorObject = {
        name: err.name,
        message: err.message,
        statusCode: statusCode,
        stack: err.stack,
      };
    }

    console.error(`${errorObject.name} - ${statusCode}: ${err.message}`);
    console.error(err.stack);
  }

  public async handleUncaughtError(error: Error): Promise<void> {
    this.logError(error);

    if (!this.isTrustedError(error)) {
      process.exit(1);
    }
  }

  public async handleError(
    error: Error,
    responseStream: Response
  ): Promise<void> {
    // Check if the error is trusted, handle accordingly
    if (!this.isTrustedError(error)) {
      // Terminate the process if it's an untrusted error
      process.exit(1);
    }

    // Or send a response if it's a trusted error
    await this.sendErrorResponse(error, responseStream);

    // Log 5xx errors
    if (error instanceof AppError && error.statusCode.toString()[0] === '5') {
      this.logError(error);
    }
  }

  public isTrustedError(error: Error): boolean {
    // Check if the error is an instance of AppError or any other trusted error class
    return error instanceof AppError || error instanceof Error;
  }

  private async sendErrorResponse(
    error: Error,
    responseStream: Response
  ): Promise<void> {
    // Customize the response based on the trusted error
    if (error instanceof AppError) {
      responseStream.status(error.statusCode).send({
        error: error.name,
        message: error.isOperational ? error.message : '',
      });
      return;
    }

    responseStream.status(500).send({
      error: error.name === 'Error' ? 'Internal Server Error' : error.name,
      message: error.message,
    });
    return;
  }
}

export default ErrorHandler;
