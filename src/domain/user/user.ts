import moment, {Moment} from 'moment-timezone';
import validator from 'validator';
import { IEntity } from '../declarations';
import { UserData } from './declarations';

export default class User implements IEntity {
  private static checkEmail(email: string) {
    if (!validator.isEmail(email)) {
      throw new Error(`${email} is not a valid email`);
    }
  }

  public _id: string;
  public readonly createdAt?: Moment;
  public readonly email: string;
  public updatedAt?: Moment;
  public username?: string;

  constructor({ _id, createdAt, email, updatedAt, username }: UserData) {
    this._id = _id;

    User.checkEmail(email);
    this.email = email;

    if (createdAt) { this.createdAt = moment(createdAt); }
    if (updatedAt) { this.updatedAt = moment(updatedAt); }
    if (username) { this.username = username; }
  }
}
