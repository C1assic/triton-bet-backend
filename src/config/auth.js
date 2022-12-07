const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    timeToSign: 60 * 60 * 1000,
  },
  production: {
    timeToSign: 60 * 1000,
  },
};

if (!config[env]) throw new Error(`Not auth configuration for ${env} environment`);

module.exports = config[env];
