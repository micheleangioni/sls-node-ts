import { ApolloServer } from 'apollo-server-lambda';
import {APIGatewayProxyEvent, APIGatewayProxyHandler, Callback, Context} from 'aws-lambda';
import schemaCreator from './src/api';
import { getErrorResponse } from './src/api/responseGenerator';
import userRest from './src/api/user/rest';
import UserService from './src/application/user/userService';
import { userRepo } from './src/infrastructure';

// Instantiate Application Services
const userService = new UserService(userRepo);

// Create GraphQL Server

const schema = schemaCreator({ userService });

const server = new ApolloServer({
  formatError: (err) => {
    // Custom errors should have a custom statusCode property < 500
    if (err.extensions && err.extensions.exception && err.extensions.exception.statusCode < 500) {
      console.log(JSON.stringify(err));
    } else {
      console.error(JSON.stringify(err));
    }

    // Return proper error response
    const code = err.extensions && err.extensions.exception && err.extensions.exception.code
      ? err.extensions.exception.code
      : undefined;
    const statusCode = err.extensions && err.extensions.exception && err.extensions.exception.statusCode
      ? err.extensions.exception.statusCode
      : 500;

    return getErrorResponse(err.message, code, statusCode);
  },
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
