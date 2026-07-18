import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private escapeValue(value: unknown): string {
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
    message: unknown,
    ...optionalParams: unknown[]
  ): string {
    const fields: Record<string, unknown> = {
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

  log(message: unknown, ...optionalParams: unknown[]) {
    process.stdout.write(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    process.stderr.write(
      this.formatMessage('error', message, ...optionalParams),
    );
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    process.stdout.write(
      this.formatMessage('warn', message, ...optionalParams),
    );
  }

  debug(message: unknown, ...optionalParams: unknown[]) {
    process.stdout.write(
      this.formatMessage('debug', message, ...optionalParams),
    );
  }

  verbose(message: unknown, ...optionalParams: unknown[]) {
    process.stdout.write(
      this.formatMessage('verbose', message, ...optionalParams),
    );
  }
}
