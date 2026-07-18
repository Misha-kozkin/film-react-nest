import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let stdoutSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    stdoutSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
  });

  it('должен разделять поля табуляцией и заканчивать строку переносом', () => {
    logger.log('test message');

    const output = stdoutSpy.mock.calls[0][0] as string;
    expect(output.endsWith('\n')).toBe(true);
    expect(output).toContain('\t');
  });

  it('должен содержать поля time, level и message', () => {
    logger.log('order created');

    const output = stdoutSpy.mock.calls[0][0] as string;
    expect(output).toContain('level=log');
    expect(output).toContain('message=order created');
    expect(output).toMatch(/time=/);
  });

  it('должен экранировать символ табуляции внутри значения', () => {
    logger.log('with\ttab');

    const output = stdoutSpy.mock.calls[0][0] as string;
    expect(output).toContain('message=with\\ttab');
  });

  it('должен писать ошибки в stderr', () => {
    const stderrSpy = jest
      .spyOn(process.stderr, 'write')
      .mockImplementation(() => true);
    logger.error('fail');

    expect(stderrSpy).toHaveBeenCalled();
    stderrSpy.mockRestore();
  });
});
