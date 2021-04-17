import EventPublisher from '../application/eventPublisher';
import {IUserRepo} from '../domain/user/IUserRepo';
import dynamoDBUserRepoCreator from './repos/userDynamoRepo';
import mongoUserRepoCreator from './repos/userMongoRepo';
import brokerFactory from '@micheleangioni/node-messagebrokers';
import config from '../config/index';
import dynamodbInitializer from './dynamo';
import mongoInitializer from './mongo';
import Logger from './logger';

export default async (accountId: string) => {
  const logger = new Logger();

  let userRepo: IUserRepo;

  if (!process.env.DB || process.env.DB === 'dynamodb') {
    const { User } = dynamodbInitializer();
    userRepo = dynamoDBUserRepoCreator(User);
  } else if (process.env.DB === 'mongo') {
    const { User } = await mongoInitializer();
    userRepo = mongoUserRepoCreator(User);
  } else {
    throw new Error(`${process.env.DB} is not a valid database`);
  }

  // When running with serverless-offline, a valid accountId must be manually added
  const snsBroker = brokerFactory(config.sns.topics, {
    awsAccountId: accountId === 'offlineContext_accountId'
      ? '000000000000'
      : accountId,
  });
  await snsBroker.init({
    createTopics: false,
  });
  const eventPublisher = new EventPublisher(snsBroker, logger);

  return {
    eventPublisher,
    logger,
    userRepo,
  };
};
