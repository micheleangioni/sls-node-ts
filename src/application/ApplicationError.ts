import { ApplicationErrorData } from './declarations';

export class ApplicationError extends Error {
  public readonly code: string;
  public readonly error?: Error;
  public readonly message: string;
  public readonly statusCode: number;
  public readonly stack?: string;

  constructor({ code, error, statusCode }: ApplicationErrorData) {
    super(typeof error === 'string' ? error : error.message);

    this.code = code;
    this.message = typeof error === 'string' ? error : error.message.toString();
    this.statusCode = statusCode;
  }

  public toString(): string {
    return JSON.stringify({
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      ...(this.stack && { stack: this.stack }),
    });
  }
}
