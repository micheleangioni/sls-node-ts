import { CustomAuthorizerResult, PolicyDocument, Statement } from 'aws-lambda';
import { Dictionary } from '../../domain/declarations';

// Policy helper function
export default (principalId: string, effect: string, resource: string, context?: Dictionary<any>) => {
  const policyDocument: PolicyDocument = {
    Statement: [],
    Version: '2012-10-17',
  };

  const statementOne: Statement = {
    Action: 'execute-api:Invoke',
    Effect: effect,
    Resource: resource,
  };

  policyDocument.Statement[0] = statementOne;

  const authResponse: CustomAuthorizerResult = {
    policyDocument,
    principalId,
  };

  if (context) {
    authResponse.context = context;
  }

  return authResponse;
};
