export interface IDomainEvent {
  getEventAggregate(): string;
  getEventName(): string;
  getEventData(): any;
}
