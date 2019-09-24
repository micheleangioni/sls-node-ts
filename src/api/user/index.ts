import UserService from '../../application/user/userService';

export default function (userService: UserService) {
  return {
    resolvers: {
      Query: {
        getUsers: async () => {
          return await userService.getAll();
        },
      },
    },
    typeDef: `
      type User {
        _id: String
        email: String!
        username: String!
      }
      extend type Query {
        getUsers: [User]
      }
    `,
  };
}


