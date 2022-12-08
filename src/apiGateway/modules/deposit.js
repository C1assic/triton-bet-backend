const gql = require('graphql-tag');
const InternalServerGraphQLError = require('../errors/InternalServerGraphQLError');
const depositService = require('../../services/deposit');

module.exports = {
  id: 'deposit',
  typeDefs: gql`
    type Query {
      myDeposits: [Deposit] @auth(error: true) @rateLimit(window: "1s", max: 5)
      depositConfig: DepositConfig @auth(error: true) @rateLimit(window: "1s", max: 5)
    }

    type Mutation {
      deposit(hash: Hex!, from: EthAddress!): Deposit @auth(error: true) @rateLimit(window: "3s", max: 1)
    }

    type Deposit {
      id: Int!
      timestamp: Timestamp
      amount: Float
      bonus: Float
      hash: Hex
      from: EthAddress
      to: EthAddress
      blockNumber: Int
      status: String
      createdAt: Timestamp
    }

    type DepositConfig {
      enable: Boolean
      contractAddress: EthAddress
      receiverAddress: EthAddress
      confirmationQty: Int
    }
  `,
  resolvers: {
    Query: {
      myDeposits: (root, args, { userId }) =>
        depositService.getDepositsByUserId({ userId }).catch(() => {
          throw new InternalServerGraphQLError();
        }),
      depositConfig: () =>
        depositService.getConfig().catch(() => {
          throw new InternalServerGraphQLError();
        }),
    },
    Mutation: {
      deposit: (root, { hash, from }, { userId }) =>
        depositService.createDeposit({ hash, from, userId }).catch(() => {
          throw new InternalServerGraphQLError();
        }),
    },
  },
};
