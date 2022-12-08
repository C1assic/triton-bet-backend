const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "BalanceOperations", deps: []
 * addColumn(operationId) => "Withdrawals"
 * changeColumn(status) => "Deposits"
 *
 */

const info = {
  revision: 3,
  name: "noname",
  created: "2022-12-08T10:46:48.772Z",
  comment: "",
};

const migrationCommands = (transaction) => [
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
          type: Sequelize.INTEGER.UNSIGNED,
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
    fn: "addColumn",
    params: [
      "Withdrawals",
      "operationId",
      {
        type: Sequelize.INTEGER.UNSIGNED,
        field: "operationId",
        comment: "ID операции",
        allowNull: false,
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Deposits",
      "status",
      {
        type: Sequelize.ENUM("Expected", "Received", "Error"),
        field: "status",
        comment: "Статус депозита",
        defaultValue: "Expected",
        allowNull: false,
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "removeColumn",
    params: ["Withdrawals", "operationId", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["BalanceOperations", { transaction }],
  },
  {
    fn: "changeColumn",
    params: [
      "Deposits",
      "status",
      {
        type: Sequelize.ENUM("Expected", "Received"),
        field: "status",
        comment: "Статус депозита",
        defaultValue: "Expected",
        allowNull: false,
      },
      { transaction },
    ],
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
