const { withFilter } = require('graphql-subscriptions');
const gql = require('graphql-tag');
const InternalServerGraphQLError = require('../errors/InternalServerGraphQLError');
const { provider, msgNames } = require('../../pubSub');
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

    type Subscription {
      balanceUpdate: Balance @auth(error: true)
    }
  `,
  resolvers: {
    User: {
      balance: ({ id }) =>
        balanceService.getBalance({ userId: id }).catch(() => {
          throw new InternalServerGraphQLError();
        }),
    },
    Subscription: {
      balanceUpdate: {
        subscribe: withFilter(
          () => provider.asyncIterator([msgNames.BALANCE_UPDATE]),
          (payload, args, { userId }) => payload.userId && userId === payload.id,
        ),
      },
    },
  },
};
