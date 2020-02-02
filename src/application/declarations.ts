import {IDomainEvent} from '../domain/IDomainEvent';

export type GroupedByAggregateEvents = {
  [aggregate: string]: IDomainEvent[],
};

export type GroupedByAggregateCloudEvents = {
  [aggregate: string]: any[],
};
