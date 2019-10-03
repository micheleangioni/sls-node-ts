import { ApolloServer } from 'apollo-server-lambda';
import {APIGatewayProxyEvent, APIGatewayProxyHandler, Callback, Context} from 'aws-lambda';
import schemaCreator from './src/api';
import apolloErrorHandler from './src/api/apolloErrorHandler';
import authorizer from './src/api/authorizer';
import userRest from './src/api/user/rest';
import UserService from './src/application/user/userService';
import { userRepo } from './src/infrastructure';

// Instantiate Application Services
const userService = new UserService(userRepo);

// Create GraphQL Server

const schema = schemaCreator({ userService });

const server = new ApolloServer({
  // Share the event and context objects accross all resolvers
  context: ({ event, context }) => ({
    context,
    event,
    headers: event.headers,
  }),
  formatError: apolloErrorHandler,
  schema,
});

/**
 * Using AWS API Gateway Custom Authorizer to perform Authentication.
 *
 * @see https://serverless.com/blog/strategies-implementing-user-authentication-serverless-applications/
 * @see https://serverless.com/framework/docs/providers/aws/events/apigateway/#http-endpoints-with-custom-authorizers/
 * @see https://aws.amazon.com/blogs/compute/introducing-custom-authorizers-in-amazon-api-gateway/
 */
export { authorizer };

export function graphqlHandler(lambdaEvent: APIGatewayProxyEvent, lambdaContext: Context, callback: Callback) {
  const handler = server.createHandler();

  return handler(lambdaEvent, lambdaContext, callback);
}

// Add REST endpoints

const restHandlers = userRest(userService);

export const getUsers: APIGatewayProxyHandler = async (event, context) => {
  return await restHandlers.getUsers({}, { event, context });
};
