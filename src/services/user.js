const { User } = require('../db/models');

const createUser = async ({ address, transaction }) => {
  const user = await User.create(
    {
      address,
    },
    {
      transaction,
    },
  );

  return user;
};

const getUserById = async ({ id, transaction }) => {
  const user = await User.findOne({
    where: {
      id,
    },
    transaction,
  });

  return user;
};

const getUserByAddress = async ({ address, transaction }) => {
  let user = await User.findOne({
    where: {
      address,
    },
    transaction,
  });

  if (!user) user = await createUser({ address, transaction });

  return user;
};

const service = {
  createUser,
  getUserById,
  getUserByAddress,
};

module.exports = service;
