import EventPublisher from '../application/eventPublisher';
import Logger from './logger';
import userRepoCreator from './repos/userRepo';
import brokerFactory from '@micheleangioni/node-messagebrokers';
import config from '../config/index';

export default async function () {
  // Add logger
  const logger = new Logger();

  // The repos need the secrets to be loaded
  // Require is used as dynamic imports is currently a Stage 4 (i.e. finished) proposal
  // https://github.com/tc39/proposals/blob/master/finished-proposals.md
  const {User} = require('./mongo');
  const userRepo = userRepoCreator(User);

  const snsBroker = brokerFactory(config.sns.topics);
  const eventPublisher = new EventPublisher(snsBroker, logger);

  return {
    eventPublisher,
    logger,
    userRepo,
  };
}
