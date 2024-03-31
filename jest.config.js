const config = {
  verbose: true,
  testTimeout: 3000,
  maxWorkers: 1,
  setupFilesAfterEnv: ['./jest.setup.js'],
};

module.exports = async () => {
  if (!process.env.BROWSER) return config;
  global.window = global;
  return {
    ...config,
  };
};
