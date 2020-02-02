import {IDomainEvent} from './IDomainEvent';

export default interface IEntity {
  readonly _id: string;
  releaseDomainEvents(): IDomainEvent[];
}
