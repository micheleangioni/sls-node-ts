import ILogger from './ILogger';

type AnyDictionary = { [s: string]: any };

const stringifyMessageProperties = (message: any, level: keyof ILogger): string => {
  return JSON.stringify(Object.getOwnPropertyNames(message)
    .reduce((plainObject, key) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      plainObject[key] = message[key];

      return plainObject;
    }, { level } as AnyDictionary));
};

const stringifyNonStackedErrorMessage = (message: any, level: keyof ILogger): string => {
  if (message == null) {
    return JSON.stringify({ level });
  }

  if (typeof message === 'string') {
    try {
      const parsedMessage = JSON.parse(message) as AnyDictionary | any[];

      return JSON.stringify({ ...parsedMessage, ...{ level } });
    } catch (_) {
      return `level: ${level}, ${message}`;
    }
  }

  return stringifyMessageProperties(message, level);
};

/**
 * Stringify input message into a string, taking care of hidden properties in case it is a native Js Error.
 * Also add a logging level.
 *
 * @see https://tinyurl.com/t9gcsq6
 * @param {any} message
 * @param {keyof ILogger} level
 * @return string
 */
export default (message: any, level: keyof ILogger): string => {
  return message != null && message.stack
    ? stringifyMessageProperties(message, level)
    : stringifyNonStackedErrorMessage(message, level);
};
