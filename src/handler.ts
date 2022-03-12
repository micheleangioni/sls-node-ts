/* eslint-disable max-len */
import {ApolloServer} from 'apollo-server-lambda';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import {APIGatewayProxyCallbackV2, APIGatewayProxyEventV2} from 'aws-lambda/trigger/api-gateway-proxy';
import schemaCreator from './api';
import apolloErrorHandler from './api/apolloErrorHandler';
import applicationErrorHandler from './api/applicationErrorHandler';
import authorizerV1 from './api/authorizer/v1';
import authorizerV2 from './api/authorizer/v2';
import userRest from './api/user/rest';
import EventPublisher from './application/eventPublisher';
import UserService from './application/user/userService';
import { Dictionary } from './domain/declarations';
import { IUserRepo } from './domain/user/IUserRepo';
import infraServicesCreator from './infrastructure';
import ILogger from './infrastructure/logger/ILogger';
import { loadSecrets } from './infrastructure/secrets';

// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
console.log(`Booting SLS-NODE-TS in ${process.env.NODE_ENV} NODE_ENV and in ${process.env.ENV} ENV.`);

type ApolloHandler = (
  event: APIGatewayProxyEventV2,
  context: Context,
  callback: APIGatewayProxyCallbackV2,
) => void;

// Connection instances must be defined OUTSIDE the Lambda handlers to be shared amongst Lambda calls

let apolloHandler: ApolloHandler;
let logger: ILogger;
let restHandlers: Dictionary<APIGatewayProxyHandler>;
let services: { userService: UserService };

/**
 * Create the Service Instances to be shared amongst the Lambda Functions.
 */
const createServiceInstances = async (accountId: string) => {
  if (services) {
    return services;
  }

  // First load secrets into env variables
  const loadFromAWSSecrets = ['production', 'staging'].includes(process.env.ENV || 'development');
  await loadSecrets(loadFromAWSSecrets);

  let infraServices: { eventPublisher: EventPublisher; logger: ILogger; userRepo: IUserRepo };

  try {
    // eslint-disable-next-line prefer-const
    infraServices = await infraServicesCreator(accountId);
    logger = infraServices.logger;
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.error('Error on infrastructure services startup', e);
    throw e;
  }

  // Create Service Instances
  const userService = new UserService(infraServices.userRepo, infraServices.eventPublisher);

  services = {
    userService,
  };

  return services;
};

/**
 * Create the Apollo Handler at cold start.
 */
const createApolloHandler = async (accountId: string): Promise<ApolloHandler> => {
  if (apolloHandler) {
    return apolloHandler;
  }

  const { userService } = services
    ? services
    : await createServiceInstances(accountId);

  // Create GraphQL Server

  const schema = schemaCreator({ userService });

  const server = new ApolloServer({
    context: ({ event, context }: { event: APIGatewayProxyEventV2; context: Context }) => ({
      context,
      event,
      headers: event.headers,
    }),
    formatError: apolloErrorHandler(logger),
    introspection: true,
    schema,
  });

  // Create and return the ApolloHandler
  return Promise.resolve(server.createHandler({
    expressGetMiddlewareOptions: {
      cors: {
        allowedHeaders: '*',
        credentials: true,
        origin: '*',
      },
    },
  }));
};

/**
 * Create the REST Handlers at cold start.
 */
const createRESTHandlers = async (accountId: string) => {
  if (restHandlers) {
    return restHandlers;
  }

  const { userService } = services
    ? services
    : await createServiceInstances(accountId);

  restHandlers = {
    ...userRest(userService, logger),
  };

  return restHandlers;
};

// Export GraphQL Server

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export const graphqlHandler = async (lambdaEvent: APIGatewayProxyEventV2, lambdaContext: Context) => {
  /**
   * The 3rd argument, the callback, is indeed optional.
   * @see https://www.apollographql.com/docs/apollo-server/migration/#apollo-server-lambda
   */
  // @ts-ignore
  return (await createApolloHandler('ciaone'))(lambdaEvent, lambdaContext);
};

/**
 * Using Lambda Authorizers to perform Authentication with REST API (Gateway V1).
 *
 * @see https://www.serverless.com/framework/docs/providers/aws/events/http-api#jwt-authorizers
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html
 */
export { authorizerV1 };

/**
 * Using Lambda Authorizers to perform Authentication with HTTP API (Gateway V2).
 *
 * @see https://www.serverless.com/framework/docs/providers/aws/events/http-api#using-function-from-existing-service-as-an-authorizer
 */
export { authorizerV2 };

// Add REST endpoints

const getCorsHeaders = () => {
  return {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Origin': '*',
  };
};

export const getUsers: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    await createRESTHandlers(event.requestContext.accountId);

    // @ts-ignore
    const responseBody = await restHandlers.getUsers(event, context) as APIGatewayProxyResult;

    return {
      ...responseBody,
      headers: getCorsHeaders(),
    };
  } catch (err) {
    return applicationErrorHandler(err, logger);
  }
};
