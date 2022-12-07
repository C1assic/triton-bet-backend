const { GraphQLError } = require('graphql');

class InternalServerGraphQLError extends GraphQLError {
  constructor(message) {
    super(message || 'An internal error has occurred.', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        http: {
          status: 500,
        },
      },
    });
  }
}

module.exports = InternalServerGraphQLError;
