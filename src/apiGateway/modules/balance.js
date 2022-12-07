const gql = require('graphql-tag');
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
      balance: ({ id }) => balanceService.getBalanceByUserId({ userId: id }),
    },
  },
};
