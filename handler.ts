import { ApolloServer } from 'apollo-server-lambda';
import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import schemaCreator from './src/api';
import UserService from './src/application/user/userService';
import { userRepo } from './src/infrastructure';

const schema = schemaCreator({ userService: new UserService(userRepo) });

const server = new ApolloServer({schema});

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
