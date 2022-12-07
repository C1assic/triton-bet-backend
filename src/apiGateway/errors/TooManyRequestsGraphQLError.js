const { GraphQLError } = require('graphql');

class InternalServerGraphQLError extends GraphQLError {
  constructor(message) {
    super(message || 'Too many requests.', {
      extensions: {
        code: 'TOO_MANY_REQUESTS',
        http: {
          status: 429,
        },
      },
    });
  }
}

module.exports = InternalServerGraphQLError;
