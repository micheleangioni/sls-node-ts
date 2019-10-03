import {APIGatewayProxyEvent, Context} from 'aws-lambda';
import {Dictionary} from '../domain/declarations';

export type IApiErrorResponse = {
  code: string;
  hasError: 1;
  message: string;
  statusCode: number;
};

export type ResolverContext = {
  context?: Context,
  event?: APIGatewayProxyEvent,
  headers?: Dictionary<string>,
};
