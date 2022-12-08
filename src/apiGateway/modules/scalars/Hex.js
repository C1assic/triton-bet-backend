const { GraphQLScalarType, Kind, GraphQLError } = require('graphql');
const Web3 = require('web3');

const validate = (value) => {
  if (typeof value !== 'string') throw new TypeError(`Value is not string: ${value}`);

  if (!Web3.utils.isHexStrict(value)) throw new TypeError(`Value is not a valid Hex: ${value}`);

  return value.toLowerCase();
};

module.exports = new GraphQLScalarType({
  name: 'Hex',
  serialize: validate,
  parseValue: validate,
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) throw new GraphQLError(`Can only validate strings as Hex but got a: ${ast.kind}`);

    return validate(ast.value);
  },
  extensions: {
    codegenScalarType: 'string',
  },
});
