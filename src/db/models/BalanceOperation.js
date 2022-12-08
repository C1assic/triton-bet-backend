const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BalanceOperation extends Model {
    static associate() {}
  }

  BalanceOperation.init(
    {
      basic: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0, comment: 'Базовый баланс' },
      profit: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0, comment: 'Профит' },
      bonuse: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0, comment: 'Бонусы' },
      userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, comment: 'ID пользователя' },
      doneAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Дата совершения операции',
      },
      сanceled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Была отменена',
      },
      сanceledAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Дата отмены операции',
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: 'BalanceOperation',
    },
  );

  return BalanceOperation;
};
