const { Balance } = require('../db/models');

const createBalance = async ({ userId, transaction }) => {
  const balance = await Balance.create(
    {
      userId,
    },
    {
      transaction,
    },
  );

  return balance;
};

const getBalanceByUserId = async ({ userId, transaction }) => {
  let balance = await Balance.findOne({
    where: {
      userId,
    },
    transaction,
  });

  if (!balance) balance = await createBalance({ userId, transaction });

  return balance;
};

const service = {
  createBalance,
  getBalanceByUserId,
};

module.exports = service;
