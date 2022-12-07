const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AuthToken extends Model {
    static associate() {}
  }

  AuthToken.init(
    {
      token: { type: DataTypes.STRING(255), allowNull: false, unique: true, comment: 'Токен авторизации' },
      lastRequestAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Дата последнего запроса',
      },
      authAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, comment: 'Дата авторизации' },
      authIpAddress: { type: DataTypes.STRING(50), comment: 'IP при авторизации' },
      isCanceled: { type: DataTypes.BOOLEAN, defaultValue: false, comment: 'Отозван ли токен' },
      userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, comment: 'ID пользователя' },
    },
    {
      sequelize,
      timestamps: false,
      modelName: 'AuthToken',
    },
  );

  return AuthToken;
};
