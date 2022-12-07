const { RedisPubSub } = require('graphql-redis-subscriptions');
const Redis = require('ioredis');
const redisConfig = require('../config/redis');
const msgNames = require('./msgNames');

const options = {
  ...redisConfig,
  retryStrategy: (times) => Math.min(times * 50, 2000), // reconnect after
};

const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options),
});

module.exports = {
  provider: RedisPubSub,
  msgNames,
  pubsub,
};
