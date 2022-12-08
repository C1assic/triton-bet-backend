const { Deposit } = require('../db/models');

const depositConfig = () => ({
  enable: depositConfig.enable,
  contractAddress: depositConfig.contractAddress,
  receiverAddress: depositConfig.receiverAddress,
  confirmationQty: depositConfig.confirmationQty,
});

const createDeposit = async ({ hash, from, userId, transaction }) => {
  const deposit = await Deposit.create(
    {
      hash,
      from,
      userId,
    },
    {
      transaction,
    },
  );

  return deposit;
};

const getDepositsByUserId = async ({ userId, transaction }) => {
  const deposits = await Deposit.findAll({
    where: {
      userId,
    },
    transaction,
  });

  return deposits;
};

const service = {
  depositConfig,
  createDeposit,
  getDepositsByUserId,
};

module.exports = service;
