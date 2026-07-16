import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class JsonLogger implements LoggerService {
  private formatMessage(
    level: string,
    message: any,
    ...optionalParams: any[]
  ): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      optionalParams,
    });
  }

  log(message: any, ...optionalParams: any[]): void {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: any, ...optionalParams: any[]): void {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: any, ...optionalParams: any[]): void {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }

  debug(message: any, ...optionalParams: any[]): void {
    console.debug(this.formatMessage('debug', message, ...optionalParams));
  }

  verbose(message: any, ...optionalParams: any[]): void {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }
}
