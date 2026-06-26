import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from './entity/film.entity';
import { Schedule } from './entity/schedule.entity';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmTypeOrmRepository: Repository<Film>,

    @InjectRepository(Schedule)
    private readonly scheduleTypeOrmRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<Film[]> {
    return this.filmTypeOrmRepository.find();
  }

  async findOneWithSchedule(id: string): Promise<Film | null> {
    return this.filmTypeOrmRepository.findOne({
      where: { id },
      relations: ['schedule'],
    });
  }
}
