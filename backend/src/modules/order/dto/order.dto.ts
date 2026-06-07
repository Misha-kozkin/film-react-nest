import {
  IsString,
  IsArray,
  IsNumber,
  Min,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TicketDto {
  @IsNumber({}, { message: 'Номер ряда должен быть числом' })
  @Min(1, { message: 'Номер ряда не может быть меньше 1' })
  row: number;
  @IsNumber({}, { message: 'Номер места должен быть числом' })
  @Min(1, { message: 'Номер места не может быть меньше 1' })
  seat: number;
}

export class CreateOrderDto {
  @IsString({ message: 'ID фильма должен быть строкой' })
  film: string;

  @IsString({ message: 'ID сеанса должен быть строкой' })
  session: string;

  @IsArray({ message: 'Билеты должны быть переданы в виде массива' })
  @ArrayMinSize(1, {
    message: 'Необходимо выбрать хотя бы один билет для заказа',
  })
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];
}
