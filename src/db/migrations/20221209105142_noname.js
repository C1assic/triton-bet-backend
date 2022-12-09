const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "AuthTokens", deps: []
 * createTable() => "Balances", deps: []
 * createTable() => "BalanceOperations", deps: []
 * createTable() => "Deposits", deps: []
 * createTable() => "MessageForSigns", deps: []
 * createTable() => "Users", deps: []
 * createTable() => "Withdrawals", deps: []
 *
 */

const info = {
  revision: 1,
  name: "noname",
  created: "2022-12-09T10:51:42.690Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "AuthTokens",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        token: {
          type: Sequelize.STRING(255),
          field: "token",
          comment: "Токен авторизации",
          unique: true,
          allowNull: false,
        },
        lastRequestAt: {
          type: Sequelize.DATE,
          field: "lastRequestAt",
          comment: "Дата последнего запроса",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        authAt: {
          type: Sequelize.DATE,
          field: "authAt",
          comment: "Дата авторизации",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        authIpAddress: {
          type: Sequelize.STRING(50),
          field: "authIpAddress",
          comment: "IP при авторизации",
        },
        isCanceled: {
          type: Sequelize.BOOLEAN,
          field: "isCanceled",
          comment: "Отозван ли токен",
          defaultValue: false,
        },
        userId: {
          type: Sequelize.INTEGER,
          field: "userId",
          comment: "ID пользователя",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Balances",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        basic: {
          type: Sequelize.DOUBLE,
          field: "basic",
          comment: "Базовый баланс",
          defaultValue: 0,
          allowNull: false,
        },
        profit: {
          type: Sequelize.DOUBLE,
          field: "profit",
          comment: "Профит",
          defaultValue: 0,
          allowNull: false,
        },
        bonuse: {
          type: Sequelize.DOUBLE,
          field: "bonuse",
          comment: "Бонусы",
          defaultValue: 0,
          allowNull: false,
        },
        userId: {
          type: Sequelize.INTEGER,
          field: "userId",
          comment: "ID пользователя",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "BalanceOperations",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        basic: {
          type: Sequelize.DOUBLE,
          field: "basic",
          comment: "Базовый баланс",
          defaultValue: 0,
          allowNull: false,
        },
        profit: {
          type: Sequelize.DOUBLE,
          field: "profit",
          comment: "Профит",
          defaultValue: 0,
          allowNull: false,
        },
        bonuse: {
          type: Sequelize.DOUBLE,
          field: "bonuse",
          comment: "Бонусы",
          defaultValue: 0,
          allowNull: false,
        },
        userId: {
          type: Sequelize.INTEGER,
          field: "userId",
          comment: "ID пользователя",
          allowNull: false,
        },
        doneAt: {
          type: Sequelize.DATE,
          field: "doneAt",
          comment: "Дата совершения операции",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        сanceled: {
          type: Sequelize.BOOLEAN,
          field: "сanceled",
          comment: "Была отменена",
          defaultValue: false,
          allowNull: false,
        },
        сanceledAt: {
          type: Sequelize.DATE,
          field: "сanceledAt",
          comment: "Дата отмены операции",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Deposits",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        hash: {
          type: Sequelize.STRING,
          field: "hash",
          comment: "Хэш транзакции",
          allowNull: false,
          unique: true,
        },
        from: {
          type: Sequelize.STRING,
          field: "from",
          comment: "Адресс отправителя",
          allowNull: false,
        },
        to: {
          type: Sequelize.STRING,
          field: "to",
          comment: "Адресс получателя",
          allowNull: true,
        },
        timestamp: {
          type: Sequelize.DATE,
          field: "timestamp",
          comment: "Дата совершения транзакции",
          allowNull: true,
        },
        amount: {
          type: Sequelize.DOUBLE,
          field: "amount",
          comment: "Сумма депозита",
          allowNull: true,
        },
        bonus: {
          type: Sequelize.DOUBLE,
          field: "bonus",
          comment: "Сумма бонуса",
          allowNull: true,
        },
        blockNumber: {
          type: Sequelize.INTEGER,
          field: "blockNumber",
          comment: "Номер блока содержащего транзакцию",
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM("Expected", "Received", "Error"),
          field: "status",
          comment: "Статус депозита",
          defaultValue: "Expected",
          allowNull: false,
        },
        userId: {
          type: Sequelize.INTEGER,
          field: "userId",
          comment: "ID пользователя",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "MessageForSigns",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        address: {
          type: Sequelize.STRING(50),
          field: "address",
          comment: "Адрес кошелька",
          allowNull: false,
        },
        message: {
          type: Sequelize.STRING,
          field: "message",
          comment: "Сообщение на подпись",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          comment: "Дата добавления",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        wasUsed: {
          type: Sequelize.BOOLEAN,
          field: "wasUsed",
          comment: "Было использовано",
          defaultValue: false,
          allowNull: false,
        },
        userId: {
          type: Sequelize.INTEGER,
          field: "userId",
          comment: "ID пользователя",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Users",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        address: {
          type: Sequelize.STRING(50),
          field: "address",
          comment: "Адрес кошелька",
          unique: true,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Withdrawals",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        amount: {
          type: Sequelize.DOUBLE,
          field: "amount",
          comment: "Сумма вывода в USDT",
          allowNull: false,
        },
        hash: {
          type: Sequelize.STRING,
          field: "hash",
          comment: "Хэш транзакции",
          allowNull: true,
        },
        from: {
          type: Sequelize.STRING(50),
          field: "from",
          comment: "Адресс отправителя",
          allowNull: true,
        },
        to: {
          type: Sequelize.STRING(50),
          field: "to",
          comment: "Адресс получателя",
          allowNull: false,
        },
        nonce: {
          type: Sequelize.INTEGER,
          field: "nonce",
          comment: "Уникальный номер транзакции",
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM(
            "Awaiting processing",
            "In processing",
            "Processed",
            "Canceled",
            "Rejected",
            "Error"
          ),
          field: "status",
          comment: "Статус заявки на вывод",
          defaultValue: "Awaiting processing",
          allowNull: false,
        },
        userId: {
          type: Sequelize.INTEGER,
          field: "userId",
          comment: "ID пользователя",
          allowNull: false,
        },
        operationId: {
          type: Sequelize.INTEGER,
          field: "operationId",
          comment: "ID операции",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["AuthTokens", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Balances", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["BalanceOperations", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Deposits", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["MessageForSigns", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Users", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Withdrawals", { transaction }],
  },
];

const pos = 0;
const useTransaction = true;

const execute = (queryInterface, sequelize, _commands) => {
  let index = pos;
  const run = (transaction) => {
    const commands = _commands(transaction);
    return new Promise((resolve, reject) => {
      const next = () => {
        if (index < commands.length) {
          const command = commands[index];
          console.log(`[#${index}] execute: ${command.fn}`);
          index++;
          queryInterface[command.fn](...command.params).then(next, reject);
        } else resolve();
      };
      next();
    });
  };
  if (useTransaction) return queryInterface.sequelize.transaction(run);
  return run(null);
};

module.exports = {
  pos,
  useTransaction,
  up: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, migrationCommands),
  down: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, rollbackCommands),
  info,
};
