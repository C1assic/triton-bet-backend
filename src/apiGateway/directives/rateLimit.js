const { mapSchema, MapperKind, getDirective } = require('@graphql-tools/utils');
const { getGraphQLRateLimiter, RedisStore } = require('graphql-rate-limit');
const gql = require('graphql-tag');
const { defaultFieldResolver } = require('graphql');
const { redis } = require('../../redis');
const TooManyRequestsGraphQLError = require('../errors/TooManyRequestsGraphQLError');

const DIRECTIVE_NAME = 'rateLimit';

const rateLimitOptions = {
  identifyContext: (ctx) => ctx?.userId || ctx?.ip,
  formatError: ({ fieldName }) => `Woah there, you are doing way too much ${fieldName}.`,
  store: new RedisStore(redis),
};

const rateLimiter = getGraphQLRateLimiter(rateLimitOptions);

const typeDefs = gql`
  directive @rateLimit(
    max: Int
    window: String
    message: String
    identityArgs: [String]
    arrayLengthField: String
  ) on FIELD_DEFINITION
`;

module.exports = {
  name: DIRECTIVE_NAME,
  module: {
    id: `${DIRECTIVE_NAME}Directive`,
    typeDefs,
  },
  transformer: (schema) => {
    const typeDirectiveArgumentMaps = {};
    return mapSchema(schema, {
      [MapperKind.TYPE]: (type) => {
        const directive = getDirective(schema, type, DIRECTIVE_NAME)?.[0];

        if (directive) {
          typeDirectiveArgumentMaps[type.name] = directive;
        }

        return undefined;
      },
      [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
        const directive = getDirective(schema, fieldConfig, DIRECTIVE_NAME)?.[0] ?? typeDirectiveArgumentMaps[typeName];

        if (directive) {
          const newFieldConfig = fieldConfig;
          const resolve = fieldConfig?.resolve || defaultFieldResolver;

          newFieldConfig.resolve = async (source, args, context, info) => {
            const errorMessage = await rateLimiter({ source, args, context, info }, directive);
            if (errorMessage) throw new TooManyRequestsGraphQLError(errorMessage);

            return resolve(source, args, context, info);
          };

          return newFieldConfig;
        }

        return fieldConfig;
      },
    });
  },
};
