import {Moment} from 'moment-timezone';
import {BaseEvent} from '../../BaseEvent';
import {IDomainEvent} from '../../IDomainEvent';
import {UserCreatedData} from './declarations';

export class UserCreated extends BaseEvent implements IDomainEvent {
  public readonly _id: string;
  public readonly createdAt: Moment;
  public readonly email: string;
  public readonly username?: string;
  private readonly eventName = 'UserCreated';

  constructor(aggregate: string, { _id, createdAt, email, username }: UserCreatedData) {
    super(aggregate);

    this._id = _id;
    this.createdAt = createdAt;
    this.email = email;
    this.createdAt = createdAt;

    if (username) {
      this.username = username;
    }
  }

  public getEventName(): string {
    return this.eventName;
  }

  public getEventData() {
    return {
      _id: this._id,
      createdAt: this.createdAt.toISOString(),
      email: this.email,
      ...(this.username && { username: this.username }),
    };
  }
}
