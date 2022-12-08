const WithdrawalError = require('../errors/WithdrawalError');
const { pubsub, msgNames } = require('../pubSub');
const { Withdrawal } = require('../db/models');
const balanceService = require('./balance');
const config = require('../config/withdrawal');

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
  if (!config.enable) throw new WithdrawalError('Withdrawal disabled');

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

  pubsub.publish(msgNames.NEW_WITHDRAWAL, withdrawal.get({ plain: true }));

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

  pubsub.publish(msgNames.WITHDRAWAL_UPDATE, withdrawal.get({ plain: true }));

  return withdrawal;
};

const service = {
  makeWithdrawal,
  cancelWithdrawal,
  getWithdrawalsByUserId,
};

module.exports = service;
