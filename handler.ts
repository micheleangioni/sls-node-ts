import { ApolloServer } from 'apollo-server-lambda';
import { APIGatewayProxyHandler } from 'aws-lambda';
import schemaCreator from './src/api';
import UserService from './src/application/user/userService';
import { userRepo } from './src/infrastructure';

const schema = schemaCreator({ userService: new UserService(userRepo) });

const server = new ApolloServer({
  formatError: (err) => {
    // Custom errors should have a custom statusCode property < 500
    if (err.extensions && err.extensions.exception && err.extensions.exception.statusCode < 500) {
      console.log(JSON.stringify(err));
    } else {
      console.error(JSON.stringify(err));
    }

    // Return a cleaned error
    return {
      code: err.extensions && err.extensions.exception && err.extensions.exception.code
        ? err.extensions.exception.code
        : undefined,
      message: err.message,
      statusCode: err.extensions && err.extensions.exception && err.extensions.exception.statusCode
        ? err.extensions.exception.statusCode
        : undefined,
    };
  },
  schema,
});

export const hello: APIGatewayProxyHandler = async (event, _context) => {
  const allUsers = await userRepo.all();

  return {
    body: JSON.stringify({
      input: event,
      message: `Hello! ${allUsers.length} users are present in the Database`,
    }, null, 2),
    statusCode: 200,
  };
};

exports.graphqlHandler = server.createHandler();
