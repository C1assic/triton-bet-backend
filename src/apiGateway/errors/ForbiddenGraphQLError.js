const { GraphQLError } = require('graphql');

class ForbiddenGraphQLError extends GraphQLError {
  constructor(message) {
    super(message || 'You are not authorized to perform this action.', {
      extensions: {
        code: 'FORBIDDEN',
        http: {
          status: 403,
        },
      },
    });
  }
}

module.exports = ForbiddenGraphQLError;
