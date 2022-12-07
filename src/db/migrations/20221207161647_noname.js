const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "Withdrawals", deps: []
 * addColumn(status) => "Deposits"
 *
 */

const info = {
  revision: 2,
  name: "noname",
  created: "2022-12-07T16:16:47.895Z",
  comment: "",
};

const migrationCommands = (transaction) => [
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
          type: Sequelize.DOUBLE.UNSIGNED,
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
          type: Sequelize.INTEGER.UNSIGNED,
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
          type: Sequelize.INTEGER.UNSIGNED,
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
    fn: "addColumn",
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

const rollbackCommands = (transaction) => [
  {
    fn: "removeColumn",
    params: ["Deposits", "status", { transaction }],
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
