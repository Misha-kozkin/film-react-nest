import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from '../films/entity/film.entity';
import { Schedule } from '../films/entity/schedule.entity';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,

    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const { film: filmId, session: sessionId, tickets } = createOrderDto;

    const film = await this.filmRepository.findOne({ where: { id: filmId } });
    if (!film) {
      this.logger.warn(
        `Попытка создать заказ для несуществующего фильма с id: ${filmId}`,
      );
      throw new NotFoundException(`Фильм с id ${filmId} не найден`);
    }

    const session = await this.scheduleRepository.findOne({
      where: { id: sessionId, film: { id: filmId } },
      relations: ['film'],
    });

    if (!session) {
      throw new NotFoundException(`Сеанс ${sessionId} для фильма ${filmId} не найден`);
    }

    const invalidTicket = tickets.find(
      (t) => t.row > session.rows || t.seat > session.seats,
    );

    if (invalidTicket) {
      throw new BadRequestException(
        `Выбрано несуществующее место: ряд ${invalidTicket.row}, место ${invalidTicket.seat}. В зале всего рядов: ${session.rows}, мест: ${session.seats}.`
      );
    }
    
    const requestedSeats = tickets.map((t) => `${t.row}:${t.seat}`);

    const currentTakenSeats = session.taken
      ? session.taken.split(',').map((s) => s.trim())
      : [];

    const isAnySeatAlreadyTaken = requestedSeats.some((seat) =>
      currentTakenSeats.includes(seat),
    );

    if (isAnySeatAlreadyTaken) {
      this.logger.warn(
        `Отказ в бронировании: Места ${requestedSeats.join(', ')} уже заняты на сеанс ${sessionId} (Фильм: ${film.title})`,
      );
      throw new BadRequestException(
        'Одно или несколько выбранных мест уже забронированы',
      );
    }

    const updatedSeatsArray = [...currentTakenSeats, ...requestedSeats];

    session.taken = updatedSeatsArray.filter(Boolean).join(',');

    await this.scheduleRepository.save(session);

    this.logger.log(
      `Успешный заказ! Фильм: "${film.title}", Сеанс: ${session.daytime}, Забронировано мест: ${requestedSeats.length} (${requestedSeats.join(', ')})`,
    );

    return {
      total: tickets.length,
      items: tickets,
    };
  }
}
