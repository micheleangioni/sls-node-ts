import UserService from '../../application/user/userService';
import {UserCreateData} from '../../application/user/declarations';
import {Dictionary} from '../../domain/declarations';
import {ResolverContext} from '../declarations';
import transform from './transform';

export default (userService: UserService) => {
  return {
    resolvers: {
      Mutation: {
        createUser: async (
          _source: string | undefined,
          { userData }: { userData: UserCreateData },
          _context: ResolverContext,
        ) => {
          // In _context.event.requestContext.authorizer the Authorizer Context is available
          // _context.event.requestContext.authorizer.userId is the Authenticated User id

          return transform(await userService.createUser(userData, '/graphql'));
        },
      },
      Query: {
        getUsers: async (
          _source: string | undefined,
          _params: Dictionary<string|number|boolean|undefined>,
          _context: ResolverContext,
        ) => {
          // In _context.event.requestContext.authorizer the Authorizer Context is available
          // _context.event.requestContext.authorizer.userId is the Authenticated User id

          return (await userService.getAll())
            .map((user) => transform(user));
        },
      },
    },
    typeDef: `
      type User {
        _id: String
        createdAt: String,
        email: String!
        updatedAt: String
        username: String
      }
      input UserDataInput {
        email: String!
        username: String
      }
      extend type Query {
        getUsers: [User]
      }
      extend type Mutation {
        createUser(userData: UserDataInput!): User
      }
    `,
  };
};

