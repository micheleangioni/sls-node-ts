import {Dayjs} from 'dayjs';
import {BaseUserData} from '../declarations';

export type UserCreatedData = BaseUserData & {
  _id: string;
  createdAt: Dayjs;
};
