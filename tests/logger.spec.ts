import { Logger } from '../src/utils/Logger';

describe('Logger', () => {
  let originalLog: any;
  let originalError: any;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalLog = console.log;
    originalError = console.error;
    originalEnv = { ...process.env };

    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    console.log = originalLog;
    console.error = originalError;
    process.env = originalEnv;
  });

  describe('debug', () => {
    it('debe loggear en DEBUG', () => {
      process.env.LOG_LEVEL = 'DEBUG';
      Logger.debug('mensaje debug');
      expect(console.log).toHaveBeenCalledWith('mensaje debug');
    });

    it('debe loggear objeto como JSON con null por undefined', () => {
      process.env.LOG_LEVEL = 'DEBUG';
      const obj = { a: 1, b: undefined };
      Logger.debug(obj);
      expect(console.log).toHaveBeenCalledWith(JSON.stringify({ a: 1, b: null }));
    });

    it('no debe loggear si LOG_LEVEL no incluye DEBUG', () => {
      process.env.LOG_LEVEL = 'INFO';
      Logger.debug('mensaje debug');
      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe('info', () => {
    it('debe loggear en INFO', () => {
      process.env.LOG_LEVEL = 'INFO';
      Logger.info('mensaje info');
      expect(console.log).toHaveBeenCalledWith('mensaje info');
    });

    it('debe loggear objeto como JSON', () => {
      process.env.LOG_LEVEL = 'INFO';
      const obj = { x: 10, y: undefined };
      Logger.info(obj);
      expect(console.log).toHaveBeenCalledWith(JSON.stringify({ x: 10, y: null }));
    });
  });

  describe('error', () => {
    it('debe loggear mensaje de error', () => {
      process.env.LOG_LEVEL = 'ERROR';
      Logger.error('mensaje error');
      expect(console.error).toHaveBeenCalledWith('mensaje error');
    });

    it('debe loggear objeto error como JSON', () => {
      process.env.LOG_LEVEL = 'ERROR';
      const obj = { code: 500, msg: undefined };
      Logger.error(obj);
      expect(console.error).toHaveBeenCalledWith(JSON.stringify({ code: 500, msg: null }));
    });

    it('debe loggear instancia de Error', () => {
      process.env.LOG_LEVEL = 'ERROR';
      const err = new Error('fail');
      Logger.error(err);
      expect(console.error).toHaveBeenCalledWith(err);
    });
  });
});
