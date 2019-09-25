import UserService from '../../application/user/userService';
import {UserCreateData} from '../../domain/user/declarations';
import transform from './transform';

export default function (userService: UserService) {
  return {
    resolvers: {
      Mutation: {
        createUser: async (_: string | undefined, { email, username }: UserCreateData) => {
          return transform(await userService.createUser({ email, username }));
        },
      },
      Query: {
        getUsers: async () => {
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
      extend type Query {
        getUsers: [User]
      }
      extend type Mutation {
        createUser(email: String!, username: String): User
      }
    `,
  };
}


