import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const dto: CreateOrderDto = {
    film: 'film-1',
    session: 'sch-1',
    tickets: [{ row: 1, seat: 1 }],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            createOrder: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('createOrder должен передавать dto в OrderService и вернуть его результат', async () => {
    const expected = { total: 1, items: dto.tickets };
    jest.spyOn(service, 'createOrder').mockResolvedValue(expected as any);

    const result = await controller.createOrder(dto);

    expect(service.createOrder).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expected);
  });
});
