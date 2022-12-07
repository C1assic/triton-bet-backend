const { mapSchema, MapperKind, getDirective } = require('@graphql-tools/utils');
const gql = require('graphql-tag');
const { defaultFieldResolver } = require('graphql');
const authService = require('../../services/auth');
const ForbiddenGraphQLError = require('../errors/ForbiddenGraphQLError');

const DIRECTIVE_NAME = 'auth';

const typeDefs = gql`
  directive @${DIRECTIVE_NAME}(error: Boolean = false) on OBJECT | FIELD_DEFINITION
`;

module.exports = {
  priority: 1,
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
        if (directive) typeDirectiveArgumentMaps[type.name] = directive;
        return undefined;
      },
      [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
        const directive = getDirective(schema, fieldConfig, DIRECTIVE_NAME)?.[0] ?? typeDirectiveArgumentMaps[typeName];

        if (directive) {
          const newFieldConfig = fieldConfig;
          const resolve = fieldConfig?.resolve || defaultFieldResolver;

          newFieldConfig.resolve = async (source, args, context, info) => {
            if (context?.userId) return resolve(source, args, context, info);

            if (context?.authToken) {
              context.userId = await authService.getUserIdByToken(context?.authToken);
              return resolve(source, args, context, info);
            }

            if (directive?.error) throw new ForbiddenGraphQLError('You are not authorized to perform this action.');

            return null;
          };

          return newFieldConfig;
        }

        return fieldConfig;
      },
    });
  },
};
