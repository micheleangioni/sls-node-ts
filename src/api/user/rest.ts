import UserService from '../../application/user/userService';
import {Dictionary} from '../../domain/declarations';
import applicationErrorHandler from '../applicationErrorHandler';
import {ResolverContext} from '../declarations';
import {TransformedUser} from './declarations';
import transform from './transform';

export default function (userService: UserService) {
  return {
    getUsers: async (_params: Dictionary<any> = {}, _context: ResolverContext) => {
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
