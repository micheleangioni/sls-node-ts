import brokerFactory from '@micheleangioni/node-messagebrokers';
import EventPublisher from '../application/eventPublisher';
import {IUserRepo} from '../domain/user/IUserRepo';
import dynamoDBUserRepoCreator from './repos/userDynamoRepo';
import mongoUserRepoCreator from './repos/userMongoRepo';
import config from '../config/index';
import dynamodbInitializer from './dynamo';
import mongoInitializer from './mongo';
import Logger from './logger';
import isRunningInLocalStack from './utils/isRunningInLocalStack';

// In non staging or development environments, use local SNS connection in `@micheleangioni/node-messagebrokers` package
if (isRunningInLocalStack && !process.env.SNS_ENDPOINT) {
  // If deploying to LocalStack, point SNS to the LocalStack container
  process.env.SNS_ENDPOINT = 'http://localstack:4566';
} else if (process.env.ENV === 'development' && !process.env.SNS_ENDPOINT) {
  // If using serverless-offline, point SNS to the localhost LocalStack
  process.env.SNS_ENDPOINT = 'http://localhost:4566';
}

export default async (accountId: string) => {
  const logger = new Logger();

  let userRepo: IUserRepo;

  if (!process.env.DB || process.env.DB === 'dynamo') {
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
