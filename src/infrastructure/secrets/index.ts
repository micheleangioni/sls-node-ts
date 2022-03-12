import AWS from 'aws-sdk';
import {Dictionary} from '../../domain/declarations';
import config from '../../config';

const getSecretValue = (client: AWS.SecretsManager, secretName: string): Promise<Dictionary<string>> => {
  return new Promise((resolve, reject) => {
    client.getSecretValue({SecretId: secretName}, (err: any, data) => {
      if (err) {
        if (err.code === 'DecryptionFailureException') {
          // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
          // Deal with the exception here, and/or rethrow at your discretion.
          return reject(err);
        } else if (err.code === 'InternalServiceErrorException') {
          // An error occurred on the server side.
          // Deal with the exception here, and/or rethrow at your discretion.
          return reject(err);
        } else if (err.code === 'InvalidParameterException') {
          // You provided an invalid value for a parameter.
          // Deal with the exception here, and/or rethrow at your discretion.
          return reject(err);
        } else if (err.code === 'InvalidRequestException') {
          // You provided a parameter value that is not valid for the current state of the resource.
          // Deal with the exception here, and/or rethrow at your discretion.
          return reject(err);
        } else if (err.code === 'ResourceNotFoundException') {
          // We can't find the resource that you asked for.
          // Deal with the exception here, and/or rethrow at your discretion.
          return reject(err);
        } else {
          // Other error
          return reject(err);
        }
      }

      // Decrypts secret using the associated KMS CMK.

      if (!data || !data.SecretString) {
        throw new Error(`No value available for secret ${secretName}`);
      }

      resolve(JSON.parse(data.SecretString));
    });
  });
};

/**
 * Load secrets and save them into the process.env.
 * By default, secrets are loaded from AWS Secrets.
 *
 * @param {boolean} fetchSecretsFromAWS
 * @return Promise<true>
 */
export const loadSecrets = async (fetchSecretsFromAWS = true) => {
  const region = process.env.REGION;

  // Create a Secrets Manager client
  const client = new AWS.SecretsManager({
    region,
  });

  if (fetchSecretsFromAWS) {
    const secretName = config.secret;
    const secrets = await getSecretValue(client, secretName);

    Object.keys(secrets).forEach((key) => {
      process.env[key] = secrets[key];
    });

    return true;
  }
};
