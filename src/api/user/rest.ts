import {APIGatewayProxyEvent, Context} from 'aws-lambda';
import UserService from '../../application/user/userService';
import applicationErrorHandler from '../applicationErrorHandler';
import {TransformedUser} from './declarations';
import transform from './transform';

export default function (userService: UserService) {
  return {
    getUsers: async (_event: APIGatewayProxyEvent, _context: Context) => {
      // _context.event.requestContext.authorizer.userId is the Authenticated User id

      let users: TransformedUser[];

      try {
        users = (await userService.getAll())
          .map((user) => transform(user));
      } catch (err) {
        return applicationErrorHandler(err);
      }

      return {
        body: JSON.stringify(users),
        statusCode: 200,
      };
    },
  };
}
