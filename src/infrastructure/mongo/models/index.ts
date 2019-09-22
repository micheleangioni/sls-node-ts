import { Mongoose } from 'mongoose';
import usersModel from './users/users';

export default function (mongoose: Mongoose) {
  return {
    user: usersModel(mongoose),
  };
}
