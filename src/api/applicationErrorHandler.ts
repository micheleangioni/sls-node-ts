import {APIGatewayProxyResult} from 'aws-lambda';
import {ApplicationError} from '../application/ApplicationError';
import {ErrorCodes} from '../application/declarations';
import ILogger from '../infrastructure/logger/ILogger';
import {getErrorResponse} from './responseGenerator';

export default (err: unknown, logger: ILogger): APIGatewayProxyResult => {
  if (err instanceof ApplicationError) {
    if (err.statusCode >= 500) {
      logger.error(err);
    } else {
      logger.debug(err);
    }

    return {
      body: JSON.stringify(getErrorResponse(err.message, err.code, err.statusCode)),
      statusCode: err.statusCode,
    };
  }

  logger.error(err);

  return {
    body: JSON.stringify(getErrorResponse('Internal error', ErrorCodes.INTERNAL_ERROR)),
    statusCode: 500,
  };
};
