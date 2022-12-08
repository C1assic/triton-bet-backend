const gql = require('graphql-tag');
const InternalServerGraphQLError = require('../errors/InternalServerGraphQLError');
const balanceService = require('../../services/balance');

module.exports = {
  id: 'balance',
  typeDefs: gql`
    type Balance {
      userId: Int!
      basic: Float
      profit: Float
      bonuse: Float
    }

    extend type User {
      balance: Balance
    }
  `,
  resolvers: {
    User: {
      balance: ({ id }) =>
        balanceService.getBalanceByUserId({ userId: id }).catch(() => {
          throw new InternalServerGraphQLError();
        }),
    },
  },
};
