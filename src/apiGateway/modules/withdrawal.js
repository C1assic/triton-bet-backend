const { withFilter } = require('graphql-subscriptions');
const gql = require('graphql-tag');
const BalanceError = require('../../errors/BalanceError');
const WithdrawalError = require('../../errors/WithdrawalError');
const InternalServerGraphQLError = require('../errors/InternalServerGraphQLError');
const WithdrawalGraphQLError = require('../errors/WithdrawalGraphQLError');
const withdrawalService = require('../../services/withdrawal');
const { provider, msgNames } = require('../../pubSub');

module.exports = {
  id: 'withdrawal',
  typeDefs: gql`
    type Query {
      myWithdrawals: [Withdrawal] @auth(error: true) @rateLimit(window: "1s", max: 5)
    }

    type Mutation {
      withdraw(amount: NonNegativeFloat!, to: EthAddress!): Withdrawal
        @auth(error: true)
        @rateLimit(window: "1s", max: 1)
      cancelWithdrawal(id: NonNegativeInt!): Withdrawal @auth(error: true) @rateLimit(window: "1s", max: 1)
    }

    type Withdrawal {
      id: Int!
      amount: Float
      hash: String
      from: EthAddress
      to: EthAddress
      status: String
      createdAt: Timestamp
    }

    type Subscription {
      newWithdrawal: Withdrawal @auth(error: true)
      withdrawalUpdate: Withdrawal @auth(error: true)
    }
  `,
  resolvers: {
    Query: {
      myWithdrawals: (root, args, { userId }) =>
        withdrawalService.getWithdrawalsByUserId({ userId }).catch(() => {
          throw new InternalServerGraphQLError();
        }),
    },
    Mutation: {
      withdraw: (root, { amount, to }, { userId }) =>
        withdrawalService.makeWithdrawal({ to, amount, userId }).catch((error) => {
          if (error instanceof BalanceError || error instanceof WithdrawalError)
            throw new WithdrawalGraphQLError(error.message);

          throw new InternalServerGraphQLError();
        }),
      cancelWithdrawal: (root, { id }, { userId }) =>
        withdrawalService.cancelWithdrawal({ id, userId }).catch((error) => {
          if (error instanceof BalanceError || error instanceof WithdrawalError)
            throw new WithdrawalGraphQLError(error.message);

          throw new InternalServerGraphQLError();
        }),
    },
    Subscription: {
      newWithdrawal: {
        subscribe: withFilter(
          () => provider.asyncIterator([msgNames.NEW_WITHDRAWAL]),
          (payload, args, { userId }) => payload.userId && userId === payload.id,
        ),
        resolve: (payload) => payload,
      },
      withdrawalUpdate: {
        subscribe: withFilter(
          () => provider.asyncIterator([msgNames.WITHDRAWAL_UPDATE]),
          (payload, args, { userId }) => payload.userId && userId === payload.id,
        ),
        resolve: (payload) => payload,
      },
    },
  },
};
