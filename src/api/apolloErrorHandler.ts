import {GraphQLError, GraphQLFormattedError} from 'graphql';
import ILogger from '../infrastructure/logger/ILogger';
import { getErrorResponse } from './responseGenerator';

export default (logger: ILogger) => (error: GraphQLError): GraphQLFormattedError => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const code: string = error.extensions?.exception?.code ?? 'no-code';

  // @see https://www.apollographql.com/docs/apollo-server/data/errors/ for the list of errors
  if (code === 'INTERNAL_SERVER_ERROR') {
    logger.error(error);
  } else {
    logger.info(error);
  }

  // Return proper error response
  let statusCode: number = 500;

  switch (code) {
    case 'UNAUTHENTICATED':
      statusCode = 401;
      break;
    case 'FORBIDDEN':
      statusCode = 403;
      break;
    case 'BAD_USER_INPUT':
    case 'GRAPHQL_PARSE_FAILED':
    case 'GRAPHQL_VALIDATION_FAILED':
      statusCode = 412;
      break;
    default:
      statusCode = 500;
  }

  return getErrorResponse(error.message, code, statusCode);
};
