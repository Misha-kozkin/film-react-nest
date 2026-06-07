import { ConfigService } from '@nestjs/config';

export const configProvider = {
  provide: 'CONFIG',
  inject: [ConfigService],
  useFactory: (configService: ConfigService): AppConfig => {
    const databaseUrl =
      configService.get<string>('DATABASE_URL') ||
      'mongodb://localhost:27017/prac';
    const databaseDriver =
      configService.get<string>('DATABASE_DRIVER') || 'mongodb';

    return {
      database: {
        driver: databaseDriver,
        url: databaseUrl,
      },
    };
  },
};

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
}
