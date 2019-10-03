import {APIGatewayProxyResult} from 'aws-lambda';
import { getErrorResponse } from './responseGenerator';

export default function applicationErrorHandler(err: any): APIGatewayProxyResult {
  if (err.statusCode && err.code) {
    if (err.statusCode >= 500) {
      console.error(err);
    } else {
      console.debug(err);
    }

    return {
      body: JSON.stringify(getErrorResponse(err.message, err.code, err.statusCode)),
      statusCode: err.statusCode,
    };
  }

  return {
    body: JSON.stringify(getErrorResponse('Internal error', 'InternalError')),
    statusCode: 500,
  };
}
