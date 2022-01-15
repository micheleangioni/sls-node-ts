import {GraphQLError, GraphQLFormattedError} from 'graphql';
import ILogger from '../infrastructure/logger/ILogger';
import { getErrorResponse } from './responseGenerator';

export default (logger: ILogger) => (error: GraphQLError): GraphQLFormattedError => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const code: string = error.extensions?.exception?.code ?? 'no-code';

  // @see https://www.apollographql.com/docs/apollo-server/data/errors/ for the list of errors
  if (code === 'INTERNAL_SERVER_ERROR') {
    logger.info(error);
  } else {
    logger.error(error);
  }

  // Return proper error response
  let statusCode: number = 500;

  switch (code) {
    case 'ValidationError':
      statusCode = 401;
      break;
    case 'UNAUTHENTICATED':
      statusCode = 403;
      break;
    case 'BAD_USER_INPUT':
      statusCode = 412;
      break;
    default:
      statusCode = 500;
  }

  return getErrorResponse(error.message, code, statusCode);
};
