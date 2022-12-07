const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.AuthToken);
      this.hasOne(models.Balance);
    }
  }

  User.init(
    {
      address: {
        type: DataTypes.STRING(255),
        validate: { isLowercase: true },
        allowNull: false,
        unique: true,
        comment: 'Адрес кошелька',
      },
    },
    {
      sequelize,
      modelName: 'User',
    },
  );

  return User;
};
