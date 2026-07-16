import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  const mockFilm = {
    id: 'film-1',
    title: 'Test Film',
    tags: ['drama'],
    schedule: [{ id: 'sch-1', daytime: '2026-01-01T18:00:00Z', taken: [] }],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  it('findAll должен вернуть total и items из FilmsService', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValue([mockFilm] as any);

    const result = await controller.findAll();

    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual({ total: 1, items: [mockFilm] });
  });

  it('findOne должен вернуть фильм с total и items вместо schedule', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(mockFilm as any);

    const result = await controller.findOne('film-1');

    expect(service.findOne).toHaveBeenCalledWith('film-1');
    expect(result.total).toBe(1);
    expect(result.items).toEqual(mockFilm.schedule);
    expect(result).not.toHaveProperty('schedule');
  });
});
