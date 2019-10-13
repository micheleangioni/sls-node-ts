import userRepoCreator from './repos/userRepo';

export default async function () {
  // The repos need the secrets to be loaded
  // Require is used as dynamic imports is currently a Stage 4 (i.e. finished) proposal
  // https://github.com/tc39/proposals/blob/master/finished-proposals.md
  const {User} = require('./mongo');

  const userRepo = userRepoCreator(User);

  return {
    userRepo,
  };
}
