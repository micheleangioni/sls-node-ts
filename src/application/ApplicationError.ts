import {ApplicationErrorData, ErrorCodes} from './declarations';

export class ApplicationError extends Error {
  public code: string;
  public message: string;
  public statusCode: number;

  constructor({code, message, statusCode}: ApplicationErrorData) {
    super(message);

    this.code = code || ErrorCodes.INTERNAL_ERROR;
    this.message = message || 'InternalError';
    this.statusCode = statusCode || 500;
  }

  public toString(): string {
    return JSON.stringify({
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
    });
  }
}
