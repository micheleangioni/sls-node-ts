import {APIGatewayProxyEvent, Context} from 'aws-lambda';
import {Dictionary} from '../domain/declarations';

export type ResolverContext = {
  context?: Context;
  event?: APIGatewayProxyEvent;
  headers?: Dictionary<string>;
};

export type IApiSuccessResponse = {
  [s: string]: any;
  metadata?: Metadata;
};

export type IApiErrorResponse = {
  code: string;
  hasError: 1;
  message: string;
  statusCode: number;
};

export type Metadata = {
  [s: string]: string|number|any[];
};
