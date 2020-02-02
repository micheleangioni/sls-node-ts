import { ApolloServer } from 'apollo-server-lambda';
import { APIGatewayProxyCallback, APIGatewayProxyEvent, APIGatewayProxyHandler, Context } from 'aws-lambda';
import middy from 'middy';
import { cors } from 'middy/middlewares';
import schemaCreator from './src/api';
import apolloErrorHandler from './src/api/apolloErrorHandler';
import applicationErrorHandler from './src/api/applicationErrorHandler';
import authorizer from './src/api/authorizer';
import userRest from './src/api/user/rest';
import EventPublisher from './src/application/eventPublisher';
import UserService from './src/application/user/userService';
import { Dictionary } from './src/domain/declarations';
import {IUserRepo} from './src/domain/user/IUserRepo';
import infraServicesCreator from './src/infrastructure';
import { loadSecrets } from './src/infrastructure/secrets';

// tslint:disable-next-line:no-console
console.log(`Booting SLS-NODE-TS in ${process.env.NODE_ENV} NODE_ENV and in ${process.env.ENV} ENV.`);

type ApolloHandler = (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: APIGatewayProxyCallback,
) => void;

// Connection instances must be defined OUTSIDE the Lambda handlers to be shared amongst Lambda calls

let apolloHandler: ApolloHandler;
let restHandlers: Dictionary<Function>;
let services: { userService: UserService };

/**
 * Create the Service Instances to be shared amongst the Lambda Functions.
 */
async function createServiceInstances() {
  if (services) {
    return services;
  }

  // First load secrets into env variables
  const loadFromAWSSecrets = ['production', 'staging'].includes(process.env.ENV || 'development');
  await loadSecrets(loadFromAWSSecrets);

  let infraServices: { eventPublisher: EventPublisher, userRepo: IUserRepo };

  try {
    infraServices = await infraServicesCreator();
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
}

/**
 * Create the Apollo Handler at cold start.
 */
async function createApolloHandler(): Promise<ApolloHandler> {
  if (apolloHandler) {
    return apolloHandler;
  }

  const { userService } = services
    ? services
    : await createServiceInstances();

  // Create GraphQL Server

  const schema = schemaCreator({ userService });

  const server = new ApolloServer({
    context: ({ event, context }) => ({
      context,
      event,
      headers: event.headers,
    }),
    formatError: apolloErrorHandler,
    introspection: true,
    schema,
  });

  // Create and return the ApolloHandler
  apolloHandler = server.createHandler();

  return apolloHandler;
}

/**
 * Create the REST Handlers at cold start.
 */
async function createRESTHandlers() {
  if (restHandlers) {
    return restHandlers;
  }

  const { userService } = services
    ? services
    : await createServiceInstances();

  restHandlers = {
    ...userRest(userService),
  };

  return restHandlers;
}

// Export GraphQL Server

/**
 * This trick is needed because the Apollo handler requires a callback as 3rd argument,
 * while we need to define the graphqlHandler() function as async, without using the callback.
 *
 * @see https://github.com/apollographql/apollo-server/issues/2705
 * @param {APIGatewayProxyEvent} event
 * @param {Context} context
 * @param apollo
 * @return Promise<void>
 */
function runApollo(event: APIGatewayProxyEvent, context: Context, apollo: ApolloHandler): Promise<void> {
  return new Promise((resolve, reject) => {
    const callback = (error: any, body: any) => (error ? reject(error) : resolve(body));
    apollo(event, context, callback);
  });
}

async function graphqlHandler(lambdaEvent: APIGatewayProxyEvent, lambdaContext: Context) {
  const apollo: ApolloHandler = await createApolloHandler();

  return await runApollo(lambdaEvent, lambdaContext, apollo);
}

export const enhancedGraphqlHandler: any = middy(graphqlHandler).use(cors());

/**
 * Using AWS API Gateway Lambda Authorizers to perform Authentication.
 *
 * @see https://serverless.com/blog/strategies-implementing-user-authentication-serverless-applications/
 * @see https://serverless.com/framework/docs/providers/aws/events/apigateway/#http-endpoints-with-custom-authorizers/
 * @see https://aws.amazon.com/blogs/compute/introducing-custom-authorizers-in-amazon-api-gateway/
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html
 */
export { authorizer };

// Add REST endpoints

function getCorsHeaders() {
  return {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Origin': '*',
  };
}

export const getUsers: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    await createRESTHandlers();

    const responseBody = await restHandlers.getUsers(event, context);

    return {
      ...responseBody,
      headers: getCorsHeaders(),
    };
  } catch (err) {
    return applicationErrorHandler(err);
  }
};

export const enhancedGetUsers: any = middy(getUsers).use(cors());
