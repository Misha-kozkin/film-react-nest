import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmsRepository } from './films.repository';
import { Film } from './films.schema';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async findAll(): Promise<Film[]> {
    return this.filmsRepository.findAll();
  }

  async findSchedule(id: string): Promise<any> {
    const film = await this.filmsRepository.findById(id);
    if (!film) throw new NotFoundException(`Фильм с ID ${id} не найден`);
    return {
      total: film.schedule.length,
      items: film.schedule,
    };
  }
}
