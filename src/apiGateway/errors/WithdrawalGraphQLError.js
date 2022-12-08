const { GraphQLError } = require('graphql');

class WithdrawalGraphQLError extends GraphQLError {
  constructor(message) {
    super(message || 'Withdrawal error.', {
      extensions: {
        code: 'WITHDRAWAL_ERROR',
      },
    });
  }
}

module.exports = WithdrawalGraphQLError;
