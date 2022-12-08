const WithdrawalError = require('../errors/WithdrawalError');
const { Withdrawal } = require('../db/models');
const balanceService = require('./balance');

const getWithdrawalsByUserId = async ({ userId, lock, transaction }) => {
  const withdrawals = await Withdrawal.findAll({
    where: {
      userId,
    },
    lock,
    transaction,
  });

  return withdrawals;
};

const makeWithdrawal = async ({ to, amount, userId, transaction }) => {
  const { operationId } = await balanceService.takeFromBalance({ amount, userId, transaction, useProfit: true });

  const withdrawal = await Withdrawal.create(
    {
      to,
      amount,
      userId,
      operationId,
    },
    {
      lock: true,
      transaction,
    },
  );

  return withdrawal;
};

const cancelWithdrawal = async ({ id, userId, transaction }) => {
  const withdrawal = await Withdrawal.findOne({
    where: {
      id,
      userId,
    },
    lock: true,
    transaction,
  });

  if (withdrawal) throw new WithdrawalError('Withdrawal not found');
  if (withdrawal.status !== 'Awaiting processing') throw new WithdrawalError('Withdrawal cannot be canceled');

  await balanceService.cancelOperation({ operationId: withdrawal.operationId, transaction });
  withdrawal.status = 'Canceled';

  await withdrawal.save({ transaction });

  return withdrawal;
};

const service = {
  makeWithdrawal,
  cancelWithdrawal,
  getWithdrawalsByUserId,
};

module.exports = service;
