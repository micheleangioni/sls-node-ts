import { ApolloServer, gql } from 'apollo-server-lambda';
import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import resolversCreator from './src/resolvers';

const typeDefs = gql``;

const resolvers = resolversCreator();

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

export const hello: APIGatewayProxyHandler = async (event, _context) => {
  return {
    body: JSON.stringify({
      input: event,
      message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
    }, null, 2),
    statusCode: 200,
  };
};

exports.graphqlHandler = server.createHandler();
