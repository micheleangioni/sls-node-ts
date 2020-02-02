import moment, {Moment} from 'moment-timezone';
import validator from 'validator';
import {BaseEntity} from '../BaseEntity';
import IEntity from '../IEntity';
import { UserData } from './declarations';
import {UserCreated} from './events/UserCreated';

export default class User extends BaseEntity implements IEntity {
  private static checkEmail(email: string) {
    if (!validator.isEmail(email)) {
      throw new Error(`${email} is not a valid email`);
    }
  }

  private static AGGREGATE_NAME = 'user';
  public _id: string;
  public readonly email: string;
  private _createdAt?: Moment;
  private _updatedAt?: Moment;
  private _username?: string;

  constructor({ _id, createdAt, email, updatedAt, username }: UserData) {
    super();
    this._id = _id;

    User.checkEmail(email);
    this.email = email;

    if (createdAt) { this._createdAt = moment(createdAt); }
    if (updatedAt) { this._updatedAt = moment(updatedAt); }
    if (username) { this._username = username; }
  }

  // Getters

  get createdAt(): Moment | undefined {
    return this._createdAt;
  }

  get updatedAt(): Moment | undefined {
    return this._updatedAt;
  }

  get username(): string | undefined {
    return this._username;
  }

  // Commands

  /**
   * Update the createdAt and updatedAt keys.
   * If the createdAt key was not previously set, it means this is being persisted for the first time.
   *
   * @param {Moment | Date} date
   * @return void
   */
  public updateDates(date: Moment | Date) {
    if (!this._createdAt) {
      this._createdAt = moment(date);

      this.addDomainEvent(new UserCreated(User.AGGREGATE_NAME, {
        _id: this._id,
        createdAt: this.createdAt || moment(),
        email: this.email,
        ...(this.username && { username: this.username }),
      }));
    }

    this._updatedAt = moment(date);
  }
}
