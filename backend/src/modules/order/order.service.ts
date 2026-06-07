import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from '../films/films.schema';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<Film>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const { film: filmId, session: sessionId, tickets } = createOrderDto;

    const film = await this.filmModel.findOne({ id: filmId }).exec();

    if (!film) {
      this.logger.warn(
        `Попытка создать заказ для несуществующего фильма с id: ${filmId}`,
      );
      throw new NotFoundException(`Фильм с id ${filmId} не найден`);
    }

    const session = film.schedule.find((s) => s.id === sessionId);
    if (!session) {
      this.logger.warn(
        `Попытка создать заказ для несуществующего сеанса с id: ${sessionId} (Фильм: ${film.title})`,
      );
      throw new BadRequestException(`Сеанс с id ${sessionId} не найден`);
    }

    const requestedSeats = tickets.map((t) => `${t.row}:${t.seat}`);

    const isAnySeatAlreadyTaken = requestedSeats.some((seat) =>
      session.taken.includes(seat),
    );

    if (isAnySeatAlreadyTaken) {
      this.logger.warn(
        `Отказ в бронировании: Места ${requestedSeats.join(', ')} уже заняты на сеанс ${sessionId} (Фильм: ${film.title})`,
      );
      throw new BadRequestException(
        'Одно или несколько выбранных мест уже забронированы',
      );
    }

    await this.filmModel
      .updateOne(
        { id: filmId, 'schedule.id': sessionId },
        { $push: { 'schedule.$.taken': { $each: requestedSeats } } },
      )
      .exec();

    this.logger.log(
      `Успешный заказ! Фильм: "${film.title}", Сеанс: ${session.daytime}, Забронировано мест: ${requestedSeats.length} (${requestedSeats.join(', ')})`,
    );

    return {
      film: filmId,
      session: sessionId,
      tickets,
    };
  }
}
