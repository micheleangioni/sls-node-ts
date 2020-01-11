import { IApiErrorResponse, IApiSuccessResponse, Metadata } from './declarations';

export function getSuccessResponse(
  data: object | any[],
  metadataObject?: {
    resultsName?: string,
    metadata: Metadata,
  },
): IApiSuccessResponse {
  if (metadataObject) {

    if (metadataObject.resultsName) {
      return {
        [metadataObject.resultsName]: data,
        ...metadataObject.metadata,
      };
    }

    return {
      ...data,
      ...metadataObject.metadata,
    };
  }

  return data;
}

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
