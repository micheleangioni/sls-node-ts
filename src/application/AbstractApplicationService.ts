import IEntity from '../domain/IEntity';
import EventPublisher from './eventPublisher';

export abstract class AbstractApplicationService {
  protected constructor(private eventPublisher: EventPublisher) {}

  /**
   * If SEND_DOMAIN_EVENTS is true, send the events of input City for input source.
   *
   * @param {IEntity} entity
   * @param {string} source
   * @return Promise<true>
   */
  protected async sendApplicationEvents(source: string, entity: IEntity): Promise<true> {
    if (process.env.SEND_DOMAIN_EVENTS === 'true') {
      await this.eventPublisher.publish(source, entity.releaseDomainEvents());
    }

    return true;
  }
}
