const { Balance, BalanceOperation } = require('../db/models');
const BalanceError = require('../errors/BalanceError');
const { pubsub, msgNames } = require('../pubSub');

const createOperation = async ({ userId, basic, profit, bonuse, lock, transaction }) => {
  const operation = await BalanceOperation.create(
    {
      userId,
      basic,
      profit,
      bonuse,
    },
    {
      lock,
      transaction,
    },
  );

  return operation;
};

const getBalance = async ({ userId, lock, transaction }) => {
  const balance = await Balance.findOrCreate({
    where: {
      userId,
    },
    findOrCreate: {
      userId,
    },
    lock,
    transaction,
  });

  return balance;
};

const addToBalance = async ({ userId, basic = 0, profit = 0, bonuse = 0, transaction }) => {
  const balance = await getBalance({ userId, transaction, lock: true });

  balance.basic += basic;
  balance.profit += profit;
  balance.bonuse += bonuse;

  const operation = await createOperation({ userId, basic, profit, bonuse, transaction, lock: true });
  await balance.save({ transaction });

  pubsub.publish(msgNames.BALANCE_UPDATE, balance.get({ plain: true }));

  return {
    operationId: operation.id,
    balance,
  };
};

const takeFromBalance = async ({
  userId,
  amount,
  useProfit = false,
  profitPriority = 2,
  useBasic = false,
  basicPriority = 1,
  useBonuse = false,
  bonusePriority = 0,
  transaction,
}) => {
  const balance = await getBalance({ userId, transaction, lock: true });

  let parts = [
    {
      name: 'profit',
      use: useProfit,
      priority: profitPriority,
    },
    {
      name: 'basic,',
      use: useBasic,
      priority: basicPriority,
    },
    {
      name: 'bonuse',
      use: useBonuse,
      priority: bonusePriority,
    },
  ].filters(({ use }) => use);

  if (!parts) throw new Error('Must select at least one part of the balance to take');

  parts = parts.sort((a, b) => {
    if (a.priority === b.priority) throw new Error(`Priorities for parts ${a.name} and ${b.name} are equal`);
    return b.priority - a.priority;
  });

  const diff = {};

  const remainingAmount = parts.reduce((part, currentAmount) => {
    const newAmount = Math.max(0, currentAmount - balance[part.name]);
    balance[part.name] -= currentAmount - newAmount;
    diff[part.name] = -(currentAmount - newAmount);
    return newAmount;
  }, amount);

  if (remainingAmount > 0) throw new BalanceError('Balance is not enough');

  const operation = await createOperation({ userId, ...diff, transaction, lock: true });
  await balance.save({ transaction });

  pubsub.publish(msgNames.BALANCE_UPDATE, balance.get({ plain: true }));

  return {
    operationId: operation.id,
    balance,
  };
};

const cancelOperation = async ({ operationId, transaction }) => {
  const operation = await BalanceOperation.findOne(
    {
      id: operationId,
    },
    {
      lock: true,
      transaction,
    },
  );

  if (!operation) throw new BalanceError('Operation not found');

  const balance = await getBalance({ userId: operation.userId, transaction, lock: true });

  if (balance.profit < operation.profit) throw new BalanceError('Not enough profit balance to cancel the operation');
  if (balance.basic < operation.basic) throw new BalanceError('Not enough basic balance to cancel the operation');
  if (balance.bonuse < operation.bonuse) throw new BalanceError('Not enough bonuse balance to cancel the operation');

  balance.profit -= operation.profit;
  balance.basic -= operation.basic;
  balance.bonuse -= operation.bonuse;

  operation.сanceled = true;
  operation.сanceledAt = Date.now();

  await Promise.all([operation.save({ transaction }), balance.save({ transaction })]);

  pubsub.publish(msgNames.BALANCE_UPDATE, balance.get({ plain: true }));

  return {
    operationId: operation.id,
    balance,
  };
};

const service = {
  addToBalance,
  takeFromBalance,
  cancelOperation,
  getBalance,
};

module.exports = service;
