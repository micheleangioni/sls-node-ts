import {Dictionary} from './declarations';

export interface IDomainEvent {
  getEventAggregate(): string;
  getEventName(): string;
  getEventData(): Dictionary<any>;
}
