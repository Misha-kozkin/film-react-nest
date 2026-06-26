import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'node:path';

// import { configProvider } from './app.config.provider';
import { Film } from './modules/films/entity/film.entity';
import { Schedule } from './modules/films/entity/schedule.entity';
import { FilmsModule } from './modules/films/films.module';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_URL'), // у тебя это localhost
        port: Number(configService.get<number>('DBPORT')), // порт 5432
        username: configService.get<string>('DATABASE_USERNAME'), // michaelkozkin
        password: configService.get<string>('DATABASE_PASSWORD'), // пустая строка
        database: configService.get<string>('DATABASE_NAME'), // film_project
        entities: [Film, Schedule],
        synchronize: false, // ТЗ Яндекса запрещает true на проде, таблицы мы создали сами
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),
    FilmsModule,
    OrderModule,
  ],
  controllers: [],
})
export class AppModule {}
