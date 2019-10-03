import { CustomAuthorizerEvent } from 'aws-lambda';
import { Dictionary } from '../../domain/declarations';
import policyGenerator from './policyGenerator';

export default function (
    event: CustomAuthorizerEvent,
    _context: any,
    callback: (err: any | null, policy?: Dictionary<any>,
) => void): void {
    // if (!event.authorizationToken) {
    //     return callback('Unauthorized');
    // }
    //
    // const tokenParts = event.authorizationToken.split(' ');
    // const tokenValue = tokenParts[1];
    //
    // if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
    //     return callback('Unauthorized');
    // }

    // [...] check Authorization token

    // const sub = decodedToken.sub;
    const sub = '100';

    // Add custom context to the context the Lambdas will receive upon authentication
    const custumContext = {
        userId: sub,
    };

    return callback(null, policyGenerator(sub, 'Allow', event.methodArn, custumContext));
}
