import User from '../../domain/user/user';
import {TransformedUser} from './declarations';

export default (user: User): TransformedUser => {
  return {
    _id: user._id || '',
    createdAt: user.createdAt ? user.createdAt.toISOString() : undefined,
    email: user.email,
    updatedAt: user.updatedAt ? user.updatedAt.toISOString() : undefined,
    username: user.username,
  };
};
