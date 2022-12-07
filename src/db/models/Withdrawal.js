const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Withdrawal extends Model {
    static associate() {}
  }

  Withdrawal.init(
    {
      amount: {
        type: DataTypes.DOUBLE.UNSIGNED,
        allowNull: false,
        comment: 'Сумма вывода в USDT',
      },
      hash: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Хэш транзакции',
      },
      from: {
        type: DataTypes.STRING(50),
        validate: { isLowercase: true },
        allowNull: true,
        comment: 'Адресс отправителя',
      },
      to: {
        type: DataTypes.STRING(50),
        validate: { isLowercase: true },
        allowNull: false,
        comment: 'Адресс получателя',
      },
      nonce: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        comment: 'Уникальный номер транзакции',
      },
      status: {
        type: DataTypes.ENUM('Awaiting processing', 'In processing', 'Processed', 'Canceled', 'Rejected', 'Error'),
        allowNull: false,
        defaultValue: 'Awaiting processing',
        comment: 'Статус заявки на вывод',
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        comment: 'ID пользователя',
      },
    },
    {
      sequelize,
      modelName: 'Withdrawal',
    },
  );

  return Withdrawal;
};
