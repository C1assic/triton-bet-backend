const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate() {}
  }

  User.init(
    {
      address: {
        type: DataTypes.STRING(50),
        validate: { isLowercase: true },
        allowNull: false,
        unique: true,
        comment: 'Адрес кошелька',
      },
    },
    {
      sequelize,
      modelName: 'user',
    },
  );

  return User;
};
