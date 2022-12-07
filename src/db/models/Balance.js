const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Balance extends Model {
    static associate(models) {
      this.belongsTo(models.User);
    }
  }

  Balance.init(
    {
      balance: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0, comment: 'Баланс' },
      profit: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0, comment: 'Профит' },
      bonuse: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0, comment: 'Бонус' },
    },
    {
      sequelize,
      timestamps: false,
      modelName: 'Balance',
    },
  );

  return Balance;
};
