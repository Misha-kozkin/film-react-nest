import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmsRepository } from './films.repository';
import { Film } from './entity/film.entity';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async findAll(): Promise<Film[]> {
    const films = await this.filmsRepository.findAll();

    return films.map((film) => ({
      ...film,
      tags: film.tags ? film.tags.split(',').map((t) => t.trim()) : [],
    })) as unknown as Film[];
  }

  async findOne(id: string): Promise<Film> {
    const film = await this.filmsRepository.findOneWithSchedule(id);

    if (!film) {
      throw new NotFoundException(`Фильм с id ${id} не найден`);
    }

    const formattedSchedule = film.schedule.map((session) => ({
      ...session,
      taken: session.taken ? session.taken.split(',').map((s) => s.trim()) : [],
    }));

    return {
      ...film,
      tags: film.tags ? film.tags.split(',').map((t) => t.trim()) : [],
      schedule: formattedSchedule,
    } as unknown as Film;
  }
}
