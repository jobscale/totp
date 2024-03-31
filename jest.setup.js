const logger = console;

beforeEach(() => {
  jest.useRealTimers();
  logger.dir({ beforeEach });
});

afterEach(() => {
  jest.useFakeTimers();
  logger.dir({ afterEach });
});
