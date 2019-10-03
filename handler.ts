import { ApolloServer } from 'apollo-server-lambda';
import {APIGatewayProxyEvent, APIGatewayProxyHandler, Callback, Context} from 'aws-lambda';
import schemaCreator from './src/api';
import apolloErrorHandler from './src/api/apolloErrorHandler';
import userRest from './src/api/user/rest';
import UserService from './src/application/user/userService';
import { userRepo } from './src/infrastructure';

// Instantiate Application Services
const userService = new UserService(userRepo);

// Create GraphQL Server

const schema = schemaCreator({ userService });

const server = new ApolloServer({
  formatError: apolloErrorHandler,
  schema,
});

// Add REST endpoints

const restHandlers = userRest(userService);

export const getUsers: APIGatewayProxyHandler = async (event, context) => {
  return await restHandlers.getUsers({}, { event, context });
};

export function graphqlHandler(lambdaEvent: APIGatewayProxyEvent, lambdaContext: Context, callback: Callback) {
  const handler = server.createHandler();

  return handler(lambdaEvent, lambdaContext, callback);
}
