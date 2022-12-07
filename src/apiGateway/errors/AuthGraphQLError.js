const { GraphQLError } = require('graphql');

class AuthGraphQLError extends GraphQLError {
  constructor(message) {
    super(message || 'Auth error.', {
      extensions: {
        code: 'AUTH_ERROR',
        http: {
          status: 403,
        },
      },
    });
  }
}

module.exports = AuthGraphQLError;
