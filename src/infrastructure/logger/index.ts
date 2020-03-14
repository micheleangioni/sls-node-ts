/* tslint:disable:no-console */
import ILogger from './ILogger';
import stringifyMessage from './stringifyMessage';

export default class Logger implements ILogger {
  public fatal(message: any) {
    console.error(stringifyMessage(message, 'fatal'));
  }

  public error(message: any) {
    console.error(stringifyMessage(message, 'error'));
  }

  public warning(message: any) {
    console.info(stringifyMessage(message, 'warning'));
  }

  public info(message: any) {
    console.info(stringifyMessage(message, 'info'));
  }

  public debug(message: any) {
    console.info(stringifyMessage(message, 'debug'));
  }
}
