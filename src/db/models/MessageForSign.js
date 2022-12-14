const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MessageForSign extends Model {
    static associate() {}
  }

  MessageForSign.init(
    {
      address: {
        type: DataTypes.STRING(50),
        validate: { isLowercase: true },
        allowNull: false,
        comment: 'Адрес кошелька',
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Сообщение на подпись',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Дата добавления',
      },
      wasUsed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Было использовано',
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID пользователя',
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: 'MessageForSign',
    },
  );

  return MessageForSign;
};
