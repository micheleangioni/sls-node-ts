import { makeExecutableSchema } from 'graphql-tools';
import UserService from '../application/user/userService';
import userGraphQLcreator from './user';

export default function ({ userService }: { userService: UserService }) {
  // Define empty Type Defs and Resolvers

  // tslint:disable-next-line:variable-name
  const Query = `
    type Query {
      _empty: String
    }
   `;

  const resolvers = {};

  // Merge Type Defs and Resolvers of each domain

  const userGraphQL = userGraphQLcreator(userService);

  return makeExecutableSchema({
    resolvers: { ...resolvers, ...userGraphQL.resolvers },
    typeDefs: [ Query, userGraphQL.typeDef ],
  });
}


