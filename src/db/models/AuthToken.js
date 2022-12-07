const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AuthToken extends Model {
    static associate(models) {
      this.belongsTo(models.User);
    }
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
      authIpAddress: { type: DataTypes.STRING(255), comment: 'IP при авторизации' },
      isCanceled: { type: DataTypes.BOOLEAN, defaultValue: false, comment: 'Отозван ли токен' },
    },
    {
      sequelize,
      timestamps: false,
      modelName: 'AuthToken',
    },
  );

  return AuthToken;
};
