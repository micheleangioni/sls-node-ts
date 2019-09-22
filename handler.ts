import { ApolloServer, gql } from 'apollo-server-lambda';
import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import infra from './src/infrastructure';
import resolversCreator from './src/resolvers';

const { repos } = infra();

const typeDefs = gql`
  type User {
    _id: String
    email: String!
    username: String!
  }
  type Query {
    getUsers: [User]
  }
`;

const resolvers = resolversCreator();

// @ts-ignore
const server = new ApolloServer({
  resolvers,
  typeDefs,
});

export const hello: APIGatewayProxyHandler = async (event, _context) => {
  const allUsers = await repos.user.all();

  return {
    body: JSON.stringify({
      input: event,
      message: `Hello! ${allUsers.length} users are present in the Database`,
    }, null, 2),
    statusCode: 200,
  };
};

exports.graphqlHandler = server.createHandler();
