const gql = require('graphql-tag');
const InternalServerGraphQLError = require('../errors/InternalServerGraphQLError');
const userService = require('../../services/user');

module.exports = {
  id: 'user',
  typeDefs: gql`
    type Query {
      me: User @auth(error: true) @rateLimit(window: "1s", max: 5)
    }

    type User {
      id: Int!
      address: EthAddress!
    }
  `,
  resolvers: {
    Query: {
      me: (root, args, { userId }) =>
        userService.getUserById(userId).catch(() => {
          throw new InternalServerGraphQLError();
        }),
    },
  },
};
