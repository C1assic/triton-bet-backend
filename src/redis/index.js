const Redis = require('ioredis');
const redisConfig = require('../config/redis');

const options = {
  ...redisConfig,
  retryStrategy: (times) => Math.min(times * 50, 2000), // reconnect after
};

const redis = new Redis(options);

module.exports = {
  redis,
  Redis,
};
