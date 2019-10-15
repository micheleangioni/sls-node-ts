import AWS from 'aws-sdk';
import config from '../../config';
import {Dictionary} from '../../domain/declarations';
import {SecretType} from './declarations';

function getSecretValue(client: AWS.SecretsManager, secretName: string, secretType: SecretType): Promise<string> {
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
      // Depending on whether the secret is a string or binary, one of these fields will be populated.

      if (secretType === SecretType.BINARY) {
        const buff = new Buffer(data.SecretBinary as string, 'base64');

        return resolve(buff.toString('ascii'));
      }

      let secretValue: string;

      // Let's try to parse a JSON encoded secrets. If it fails, let's use it as a plaintext secret

      try {
        const secretObject: Dictionary<string> = JSON.parse(data.SecretString as string);
        secretValue = Object.values(secretObject)[0];
      } catch (_) {
        secretValue = data.SecretString as string;
      }

      resolve(secretValue);
    });
  });
}

/**
 * Load secrets and save them into the process.env.
 * By default, secrets are loaded from AWS Secrets.
 *
 * @param {boolean} fetchSecretsFromAWS
 * @return Promise<true>
 */
export async function loadSecrets(fetchSecretsFromAWS = true) {
  const region = process.env.REGION;

  // Create a Secrets Manager client
  const client = new AWS.SecretsManager({
    region,
  });

  if (fetchSecretsFromAWS) {
    const secretList = Object.keys(config.secrets);
    const promises = secretList.map((secretName) => getSecretValue(
      client,
      // @ts-ignore
      config.secrets[secretName],
      SecretType.STRING),
    );

    const secrets = await Promise.all(promises);

    secretList.forEach((secretName, index) => {
      process.env[secretName] = secrets[index];
    });
  }

  return true;
}
