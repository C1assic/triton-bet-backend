const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Balance extends Model {
    static associate() {}
  }

  Balance.init(
    {
      basic: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0, comment: 'Базовый баланс' },
      profit: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0, comment: 'Профит' },
      bonuse: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0, comment: 'Бонусы' },
      userId: { type: DataTypes.INTEGER, allowNull: false, comment: 'ID пользователя' },
    },
    {
      sequelize,
      timestamps: false,
      modelName: 'Balance',
    },
  );

  return Balance;
};
