import EventPublisher from '../application/eventPublisher';
import userRepoCreator from './repos/userRepo';
import brokerFactory from '@micheleangioni/node-messagebrokers';
import config from '../config/index';
import mongoInitializer from './mongo';

export default async () => {
  // The logger could need the secrets to be loaded
  // Require is used as dynamic imports is currently a Stage 4 (i.e. finished) proposal
  // https://github.com/tc39/proposals/blob/master/finished-proposals.md
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Logger = require('./logger').default;
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
