import User from '../../domain/user/user';
import {TransformedUser} from './declarations';

export default function (user: User): TransformedUser {
  return {
    _id: user._id || '',
    createdAt: user.createdAt ? user.createdAt.toDate() : undefined,
    email: user.email,
    updatedAt: user.updatedAt ? user.updatedAt.toDate() : undefined,
    username: user.username,
  };
}
