import { CustomAuthorizerEvent } from 'aws-lambda';
import { Dictionary } from '../../domain/declarations';
import policyGenerator from './policyGenerator';

// tslint:disable:max-line-length

/**
 * When calling the Callback with an error, only 'Allow', 'Deny' and 'Unauthorized' are valid values.
 *
 * @see https://stackoverflow.com/questions/55064760/lambda-authorizer-not-returning-proper-error-message-with-callback-in-node-js
 */
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
    const sub = 100;

    // Add custom context to the context the Lambdas will receive upon authentication
    // All context fields MUST be strings
    const customContext = {
        userId: sub.toString(),
    };

    return callback(null, policyGenerator(sub.toString(), 'Allow', event.methodArn, customContext));
}
