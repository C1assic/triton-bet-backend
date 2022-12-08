const gql = require('graphql-tag');
const BalanceError = require('../../errors/BalanceError');
const WithdrawalError = require('../../errors/WithdrawalError');
const InternalServerGraphQLError = require('../errors/InternalServerGraphQLError');
const WithdrawalGraphQLError = require('../errors/WithdrawalGraphQLError');
const withdrawalService = require('../../services/withdrawal');

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
  },
};
