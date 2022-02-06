import {APIGatewayProxyEventV2, APIGatewayProxyHandlerV2, Context} from 'aws-lambda';

/* eslint-disable @typescript-eslint/require-await */

type APIGatewayLambdaAuthorizerResponseV2 = {
  context?: Record<string, any>;
  isAuthorized: boolean;
};

const authorizer: APIGatewayProxyHandlerV2<APIGatewayLambdaAuthorizerResponseV2>
  = async (event: APIGatewayProxyEventV2, _context: Context): Promise<APIGatewayLambdaAuthorizerResponseV2> => {
    const tokenParts = event.headers.Authorization?.split(' ');

    if (!tokenParts) {
      return {
        isAuthorized: false,
      };
    }

    const [tokenAuth, tokenValue] = tokenParts;

    if (!(tokenAuth.toLowerCase() === 'bearer' && tokenValue)) {
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
      isAuthorized: true,
    };
  };

export default authorizer;
