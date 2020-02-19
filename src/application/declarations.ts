import {IDomainEvent} from '../domain/IDomainEvent';

export type ApplicationErrorData = {
  code?: string;
  message: string;
  statusCode?: number;
};

export enum ErrorCodes {
  FORBIDDEN = 'forbidden',
  INTERNAL_ERROR = 'internal-error',
  INVALID_DATA = 'invalid-data',
  NOT_FOUND = 'not-found',
  UNAUTHORIZED = 'unauthorized',
}

export type GroupedByAggregateEvents = {
  [aggregate: string]: IDomainEvent[];
};

export type GroupedByAggregateCloudEvents = {
  [aggregate: string]: any[];
};
