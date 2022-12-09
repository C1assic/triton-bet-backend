const { User } = require('../db/models');

const getUserById = async ({ id, transaction }) => {
  const user = await User.findOne({
    where: {
      id,
    },
    transaction,
  });

  return user;
};

const getUserByAddress = async ({ address, lock, transaction }) => {
  const [user] = await User.findOrCreate({
    where: {
      address,
    },
    findOrCreate: {
      address,
    },
    lock,
    transaction,
  });

  return user;
};

const service = {
  getUserById,
  getUserByAddress,
};

module.exports = service;
