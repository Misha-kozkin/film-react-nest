import * as path from 'path';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export const winstonLoggerConfig = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, context }) => {
          return `[Nest] ${timestamp}  ${level} [${context || 'Application'}] ${message}`;
        }),
      ),
    }),

    new winston.transports.DailyRotateFile({
      dirname: path.join(process.cwd(), 'logs'),
      filename: 'combined-%DATE%.json',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),

    new winston.transports.DailyRotateFile({
      level: 'error',
      dirname: path.join(process.cwd(), 'logs'),
      filename: 'errors-%DATE%.json',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
});
