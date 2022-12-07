const gql = require('graphql-tag');
const authService = require('../../services/auth');
const userService = require('../../services/user');
const AuthError = require('../../errors/AuthError');
const InternalServerGraphQLError = require('../errors/InternalServerGraphQLError');
const AuthGraphQLError = require('../errors/AuthGraphQLError');

module.exports = {
  id: 'auth',
  typeDefs: gql`
    type Mutation {
      getMessageForSign(address: EthAddress!): String!
      auth(input: AuthInput!): String!
    }

    input AuthInput {
      address: EthAddress!
      signature: String!
    }
  `,
  resolvers: {
    Mutation: {
      async getMessageForSign(root, { address }) {
        try {
          const user = await userService.getUserByAddress({ address });

          if (!user?.id) throw new Error('Could not find user with address');

          const messageForSign = await authService.createMessageForSign({
            address,
            userId: user.id,
          });

          return messageForSign;
        } catch (err) {
          console.log(err);
          throw new InternalServerGraphQLError();
        }
      },
      async auth(root, { input }, { ip }) {
        try {
          const { signature, address } = input;

          const token = await authService.auth({
            address,
            signature,
            ip,
          });

          return token;
        } catch (err) {
          console.error(err);
          if (err instanceof AuthError) throw new AuthGraphQLError(err.message);

          throw new InternalServerGraphQLError();
        }
      },
    },
  },
};
