import {IApiErrorResponse} from './declarations';

export function getErrorResponse(
  errorMessage: string,
  code: string,
  statusCode: number = 500,
): IApiErrorResponse {
  return {
    code,
    hasError: 1,
    message: errorMessage,
    statusCode,
  };
}
