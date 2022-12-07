const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "Users", deps: []
 * createTable() => "AuthTokens", deps: [Users]
 * createTable() => "Balances", deps: [Users]
 * createTable() => "MessageForSigns", deps: [Users]
 *
 */

const info = {
  revision: 1,
  name: "noname",
  created: "2022-12-07T09:47:51.330Z",
  comment: "",
};

const migrationCommands = (transaction) => [
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
          type: Sequelize.STRING(255),
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
          type: Sequelize.STRING(255),
          field: "authIpAddress",
          comment: "IP при авторизации",
        },
        isCanceled: {
          type: Sequelize.BOOLEAN,
          field: "isCanceled",
          comment: "Отозван ли токен",
          defaultValue: false,
        },
        UserId: {
          type: Sequelize.INTEGER,
          field: "UserId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Users", key: "id" },
          allowNull: true,
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
        balance: {
          type: Sequelize.DOUBLE,
          field: "balance",
          comment: "Баланс",
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
          comment: "Бонус",
          defaultValue: 0,
          allowNull: false,
        },
        UserId: {
          type: Sequelize.INTEGER,
          field: "UserId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Users", key: "id" },
          allowNull: true,
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
          type: Sequelize.STRING(255),
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
        UserId: {
          type: Sequelize.INTEGER,
          field: "UserId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Users", key: "id" },
          allowNull: true,
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
    params: ["MessageForSigns", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Users", { transaction }],
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
