/* tslint:disable:no-console */
import ILogger from './ILogger';

export default class Logger implements ILogger {
  public fatal(message: any) {
    console.error(message);
  }

  public error(message: any) {
    console.error(message);
  }

  public warning(message: any) {
    console.info(message);
  }

  public info(message: any) {
    console.info(message);
  }

  public debug(message: any) {
    console.info(message);
  }
}
