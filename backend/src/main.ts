import { ValidationPipe, LoggerService } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { DevLogger } from './common/logger/dev.logger';
import { JsonLogger } from './common/logger/json.logger';
import { TskvLogger } from './common/logger/tskv.logger';
import 'dotenv/config';

function createLogger(): LoggerService {
  switch (process.env.LOGGER_TYPE) {
    case 'json':
      return new JsonLogger();
    case 'tskv':
      return new TskvLogger();
    default:
      return new DevLogger();
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(createLogger());

  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api/afisha');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors();

  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);
}
bootstrap();
