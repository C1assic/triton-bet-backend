const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Deposit extends Model {
    static associate() {}
  }

  Deposit.init(
    {
      hash: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        comment: 'Хэш транзакции',
      },
      from: {
        type: DataTypes.STRING,
        validate: { isLowercase: true },
        allowNull: false,
        comment: 'Адресс отправителя',
      },
      to: {
        type: DataTypes.STRING,
        validate: { isLowercase: true },
        allowNull: true,
        comment: 'Адресс получателя',
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Дата совершения транзакции',
      },
      amount: {
        type: DataTypes.DOUBLE.UNSIGNED,
        allowNull: true,
        comment: 'Сумма депозита',
      },
      bonus: {
        type: DataTypes.DOUBLE.UNSIGNED,
        allowNull: true,
        comment: 'Сумма бонуса',
      },
      blockNumber: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        comment: 'Номер блока содержащего транзакцию',
      },
      status: {
        type: DataTypes.ENUM('Expected', 'Received'),
        allowNull: false,
        defaultValue: 'Expected',
        comment: 'Статус депозита',
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        comment: 'ID пользователя',
      },
    },
    {
      sequelize,
      modelName: 'Deposit',
    },
  );

  return Deposit;
};
