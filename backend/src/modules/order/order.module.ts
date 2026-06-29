import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { FilmsModule } from '../films/films.module';
import { Film } from '../films/entity/film.entity';
import { Schedule } from '../films/entity/schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Film, Schedule]), FilmsModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
