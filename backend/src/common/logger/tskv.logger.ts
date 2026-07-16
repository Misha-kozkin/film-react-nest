import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private escapeValue(value: any): string {
    const str =
      typeof value === 'object' ? JSON.stringify(value) : String(value);
    return str
      .replace(/\\/g, '\\\\')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r');
  }

  private formatMessage(
    level: string,
    message: any,
    ...optionalParams: any[]
  ): string {
    const fields: Record<string, any> = {
      time: new Date().toISOString(),
      level,
      message,
    };

    optionalParams.forEach((param, index) => {
      fields[`param${index}`] = param;
    });

    return (
      Object.entries(fields)
        .map(([key, value]) => `${key}=${this.escapeValue(value)}`)
        .join('\t') + '\n'
    );
  }

  log(message: any, ...optionalParams: any[]) {
    process.stdout.write(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: any, ...optionalParams: any[]) {
    process.stderr.write(
      this.formatMessage('error', message, ...optionalParams),
    );
  }

  warn(message: any, ...optionalParams: any[]) {
    process.stdout.write(
      this.formatMessage('warn', message, ...optionalParams),
    );
  }

  debug(message: any, ...optionalParams: any[]) {
    process.stdout.write(
      this.formatMessage('debug', message, ...optionalParams),
    );
  }

  verbose(message: any, ...optionalParams: any[]) {
    process.stdout.write(
      this.formatMessage('verbose', message, ...optionalParams),
    );
  }
}
