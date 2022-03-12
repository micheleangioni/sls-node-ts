import {APIGatewayProxyEvent, APIGatewayProxyHandler, Context} from 'aws-lambda';
import UserService from '../../application/user/userService';
import {Dictionary} from '../../domain/declarations';
import ILogger from '../../infrastructure/logger/ILogger';
import applicationErrorHandler from '../applicationErrorHandler';
import {getSuccessResponse} from '../responseGenerator';
import {TransformedUser} from './declarations';
import transform from './transform';

export default (userService: UserService, logger: ILogger): Dictionary<APIGatewayProxyHandler> => {
  return {
    getUsers: async (_event: APIGatewayProxyEvent, _context: Context) => {
      // _context.event.requestContext.authorizer.userId is the Authenticated User id

      let users: TransformedUser[] = [];

      try {
        users = (await userService.getAll())
          .map((user) => transform(user));
      } catch (err) {
        return applicationErrorHandler(err, logger);
      }

      return {
        body: JSON.stringify(getSuccessResponse(users)),
        statusCode: 200,
      };
    },
  };
};
