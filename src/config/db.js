const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    dialect: 'postgres',
    host: 'postgres',
  },
  production: {
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    dialect: 'postgres',
    host: 'postgres',
  },
};

if (!config[env]) throw new Error(`Not database configuration for ${env} environment`);

module.exports = config[env];
