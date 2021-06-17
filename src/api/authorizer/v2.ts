import {APIGatewayProxyEventV2, APIGatewayProxyHandlerV2, Context} from 'aws-lambda';

/* eslint-disable @typescript-eslint/require-await */

type APIGatewayLambdaAuthorizerResponseV2 = {
  context?: Record<string, any>;
  isAuthorized: boolean;
};

const authorizer: APIGatewayProxyHandlerV2<APIGatewayLambdaAuthorizerResponseV2>
  = async (event: APIGatewayProxyEventV2, _context: Context): Promise<APIGatewayLambdaAuthorizerResponseV2> => {
    console.log('INSIDE THE AUTHORIZER V2');
    console.log('event', event);

    const tokenParts = (event.headers.Authorization || event.headers.Authorization)?.split(' ');

    if (!tokenParts) {
      return {
        isAuthorized: false,
      };
    }

    const [tokenAuth, tokenValue] = tokenParts;

    if (!(tokenAuth === 'bearer' && tokenValue)) {
      return {
        isAuthorized: false,
      };
    }

    // [...] check/introspect Authorization token

    // const sub = decodedToken.sub;
    const sub = 100;

    return {
      context: {
        userId: sub.toString(),
      },
      isAuthorized: false,
    };
  };

export default authorizer;
