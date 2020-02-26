import {GraphQLError, GraphQLFormattedError} from 'graphql';
import ILogger from '../infrastructure/logger/ILogger';
import { getErrorResponse } from './responseGenerator';

export default (logger: ILogger) => (error: GraphQLError): GraphQLFormattedError => {
  // Custom errors should have a custom statusCode property < 500
  if (error.extensions && error.extensions.exception && error.extensions.exception.statusCode < 500) {
    logger.info(error.toString());
  } else {
    logger.error(error.toString());
  }

  // Return proper error response
  const code = error.extensions && error.extensions.exception && error.extensions.exception.code
    ? error.extensions.exception.code
    : undefined;
  const statusCode = error.extensions && error.extensions.exception && error.extensions.exception.statusCode
    ? error.extensions.exception.statusCode
    : error.name === 'ValidationError'
      ? 412
      : 500;

  return getErrorResponse(error.message, code, statusCode);
};
