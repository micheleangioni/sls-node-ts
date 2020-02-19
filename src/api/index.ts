import deepmerge from 'deepmerge';
import { IResolvers, makeExecutableSchema } from 'graphql-tools';
import UserService from '../application/user/userService';
import userSchemacreator from './user/graphql';

export default ({ userService }: { userService: UserService }) => {
  // Define empty Type Defs and Resolvers to be extended

  // tslint:disable-next-line:variable-name
  const Query = `
    type Query {
      _empty: String
    }
    type Mutation {
      _empty: String
    }
   `;

  const resolvers = {};

  // Merge Type Defs and Resolvers of each domain

  const userSchema = userSchemacreator(userService);

  return makeExecutableSchema({
    resolvers: deepmerge.all([resolvers, userSchema.resolvers]) as IResolvers,
    typeDefs: [ Query, userSchema.typeDef ],
  });
};


