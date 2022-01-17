import dynamoose from 'dynamoose';
import {ModelType} from 'dynamoose/dist/General';
import isRunningInLocalStack from '../utils/isRunningInLocalStack';
import isRunningLocally from '../utils/isRunningLocally';
import usersSchema, { User } from './schemas/usersSchema';

export default () => {
  if (isRunningLocally) {
    // If deploying to LocalStack, point Dynamo to the LocalStack container, otherwise to the localhost LocalStack
    const connectionString = isRunningInLocalStack
      ? process.env.AWS_ENDPOINT_URL
      : 'http://localhost:4566';

    dynamoose.aws.ddb.local(connectionString);
  }

  // The check addresses a bug in Serverless Framework still present
  // for local development https://github.com/serverless/serverless/issues/5209
  const userTable = process.env.USER_TABLE && process.env.USER_TABLE !== '[object Object]'
    ? process.env.USER_TABLE
    : 'Users';

  // The following tweak allows for seeding in testing directly using Dynamoose to handle DB operations

  // eslint-disable-next-line @typescript-eslint/no-shadow
  let User: ModelType<User>;

  try {
    User = dynamoose.model<User>(userTable, usersSchema, { create: false });
  } catch (error) {
    User = dynamoose.model<User>(userTable);
  }

  return {
    User,
    dynamoose,
  };
};
