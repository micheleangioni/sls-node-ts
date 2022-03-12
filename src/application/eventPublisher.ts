import {CloudEventFactory, IBrokerInterface} from '@micheleangioni/node-messagebrokers';
import {CloudEvent} from 'cloudevents';
import {IDomainEvent} from '../domain/IDomainEvent';
import ILogger from '../infrastructure/logger/ILogger';
import {GroupedByAggregateCloudEvents, GroupedByAggregateEvents} from './declarations';

export default class EventPublisher {
  constructor(private readonly messageBroker: IBrokerInterface, private readonly logger: ILogger) {}

  /**
   * Take a list of Domain Events, convert them to the CloudEvents format and then publish them.
   *
   * @param {string} source
   * @param {IDomainEvent[} events
   */
  public async publish(source: string, events: IDomainEvent[]) {
    // Group events by aggregate

    const groupedEvents = events.reduce((acc: GroupedByAggregateEvents, event) => {
      if (!acc[event.getEventAggregate()]) {
        acc[event.getEventAggregate()] = [event];
      } else {
        acc[event.getEventAggregate()].push(event);
      }

      return acc;
    }, {});

    // Convert events to CloudEvents format

    const groupedCloudevents = Object.keys(groupedEvents)
      .reduce((acc: GroupedByAggregateCloudEvents, aggregate) => {
        acc[aggregate] = groupedEvents[aggregate].map(
          (domainEvent) => this.convertDomainEventToCloudEvent(source, domainEvent),
        );

        return acc;
      }, {});

    // Publish the events

    const promises = Object.keys(groupedCloudevents).map((aggregate: string) => {
      return this.messageBroker.sendMessage(aggregate, groupedCloudevents[aggregate]);
    });

    await Promise.all(promises);

    if (events.length === 1) {
      this.logger.info({
        data: events[0].getEventData(),
        message: `Successfully published ${events[0].getEventAggregate()} ${events[0].getEventName()} event`,
        type: 'sns',
      });
    } else {
      Object.keys(groupedEvents).forEach((aggregate) => {
        this.logger.info({
          message: `Successfully published ${groupedEvents[aggregate].length} ${aggregate} events`,
          type: 'sns',
        });
      });
    }
  }

  private convertDomainEventToCloudEvent(source: string, event: IDomainEvent): CloudEvent {
    return CloudEventFactory.createV1(event.getEventAggregate(), event.getEventName(), source, event.getEventData());
  }
}
