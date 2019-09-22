import mongoose from './mongo';
import models from './mongo/models';
import UserRepo from './repos/userRepo';

export default function () {
  const { user } = models(mongoose);

  return {
    repos: {
      user: UserRepo(user),
    },
  };
}
