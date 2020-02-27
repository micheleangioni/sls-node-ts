import EventPublisher from '../application/eventPublisher';
import userRepoCreator from './repos/userRepo';
import brokerFactory from '@micheleangioni/node-messagebrokers';
import config from '../config/index';
import mongoInitializer from './mongo';
import Logger from './logger';

export default async () => {
  const logger = new Logger();

  const { User } = await mongoInitializer();
  const userRepo = userRepoCreator(User);

  const snsBroker = brokerFactory(config.sns.topics);
  await snsBroker.init();
  const eventPublisher = new EventPublisher(snsBroker, logger);

  return {
    eventPublisher,
    logger,
    userRepo,
  };
};
