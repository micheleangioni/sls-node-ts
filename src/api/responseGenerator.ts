import {Dictionary} from '../domain/declarations';
import { IApiErrorResponse, IApiSuccessResponse, Metadata } from './declarations';

export const getSuccessResponse = (
  data: Dictionary<any> | any[],
  metadataObject?: {
    resultsName?: string;
    metadata: Metadata;
  },
): IApiSuccessResponse => {
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
};

export const getErrorResponse = (
  errorMessage: string,
  code: string,
  statusCode: number = 500,
): IApiErrorResponse => {
  return {
    code,
    hasError: 1,
    message: errorMessage,
    statusCode,
  };
};
