const { mergeResolvers, mergeTypeDefs } = require('@graphql-tools/merge');
const { typeDefs, resolvers } = require('graphql-scalars');
const path = require('path');
const fs = require('fs');

const basename = path.basename(__filename);

const customResolvers = {};
const customTypeDefs = [];

fs.readdirSync(__dirname)
  .filter((file) => file !== basename && (file.slice(-3) === '.js' || file.indexOf('.') === -1))
  .forEach((file) => {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const scalar = require(path.join(__dirname, file));
    customResolvers[scalar.name] = scalar;
    customTypeDefs.push(`scalar ${scalar.name}`);
  });

module.exports = {
  id: 'scalars',
  typeDefs: mergeTypeDefs([typeDefs, customTypeDefs], {
    useSchemaDefinition: false,
  }),
  resolvers: mergeResolvers([resolvers, customResolvers]),
};
