import dayjs, {Dayjs} from 'dayjs';
import validator from 'validator';
import {BaseEntity} from '../BaseEntity';
import IEntity from '../IEntity';
import {UserData} from './declarations';
import {UserCreated} from './events/UserCreated';

export default class User extends BaseEntity implements IEntity {
  private static AGGREGATE_NAME = 'user';

  private static checkEmail(email: string) {
    if (!validator.isEmail(email)) {
      throw new Error(`${email} is not a valid email`);
    }
  }

  public readonly email: string;
  public _id: string;
  private _createdAt?: Dayjs;
  private _updatedAt?: Dayjs;
  private _username?: string;

  constructor({ _id, createdAt, email, updatedAt, username }: UserData) {
    super();
    this._id = _id;

    User.checkEmail(email);
    this.email = email;

    if (createdAt) { this._createdAt = dayjs(createdAt); }

    if (updatedAt) { this._updatedAt = dayjs(updatedAt); }

    if (username) { this._username = username; }
  }

  // Getters

  get createdAt(): Dayjs | undefined {
    return this._createdAt;
  }

  get updatedAt(): Dayjs | undefined {
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
   * @param {Dayjs | Date} date
   * @return void
   */
  public updateDates(date: Dayjs | Date) {
    if (!this._createdAt) {
      this._createdAt = dayjs(date);

      this.addDomainEvent(new UserCreated(User.AGGREGATE_NAME, {
        _id: this._id,
        createdAt: this.createdAt || dayjs(),
        email: this.email,
        ...(this.username && { username: this.username }),
      }));
    }

    this._updatedAt = dayjs(date);
  }
}
