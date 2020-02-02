import {IDomainEvent} from './IDomainEvent';

export abstract class BaseEntity {
  private domainEvents: IDomainEvent[] = [];

  public addDomainEvent(domainEvent: IDomainEvent): void {
    this.domainEvents.push(domainEvent);
  }

  public releaseDomainEvents(): IDomainEvent[] {
    const events = this.domainEvents;
    this.domainEvents = [];

    return events;
  }
}
