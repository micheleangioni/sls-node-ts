import validator from 'validator';
import { IEntity } from '../declarations';
import { UserData } from './declarations';

export default class User implements IEntity {
  private static checkEmail(email: string) {
    if (!validator.isEmail(email)) {
      throw new Error(`${email} is not a valid email`);
    }
  }

  public _id?: string;
  public readonly email: string;
  public password: string;
  public username: string | null = null;

  constructor({ _id, email, password, username }: UserData) {
    if (_id) { this._id = _id; }

    User.checkEmail(email);
    this.email = email;
    this.password = password;

    if (username) { this.username = username; }
  }
}
