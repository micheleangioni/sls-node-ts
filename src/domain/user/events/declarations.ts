import {Moment} from 'moment-timezone';
import {BaseUserData} from '../declarations';

export type UserCreatedData = BaseUserData & {
  _id: string;
  createdAt: Moment;
};
