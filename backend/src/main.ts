import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { winstonLoggerConfig } from './common/logger.config';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLoggerConfig,
  });

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
  console.log(`сервер запущен на порту: ${port}`);
}
bootstrap();
