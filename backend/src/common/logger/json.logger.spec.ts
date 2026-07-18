import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    consoleLogSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('должен выводить сообщение в формате валидного JSON', () => {
    logger.log('test message');

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    const output = consoleLogSpy.mock.calls[0][0];
    expect(() => JSON.parse(output)).not.toThrow();
  });

  it('должен включать level, message и timestamp в вывод', () => {
    logger.log('Список фильмов успешно загружен');

    const parsed = JSON.parse(consoleLogSpy.mock.calls[0][0]);
    expect(parsed.level).toBe('log');
    expect(parsed.message).toBe('Список фильмов успешно загружен');
    expect(parsed.timestamp).toBeDefined();
  });

  it('должен включать дополнительные параметры в optionalParams', () => {
    logger.log('order created', 'OrderService', { orderId: 1 });

    const parsed = JSON.parse(consoleLogSpy.mock.calls[0][0]);
    expect(parsed.optionalParams).toEqual(['OrderService', { orderId: 1 }]);
  });
});
