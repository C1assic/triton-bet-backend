const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    host: 'redis',
    port: 6379,
  },
  production: {
    host: 'redis',
    port: 6379,
  },
};

if (!config[env]) throw new Error(`Not redis configuration for ${env} environment`);

module.exports = config[env];
