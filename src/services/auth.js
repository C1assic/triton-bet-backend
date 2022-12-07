const { recoverPersonalSignature } = require('@metamask/eth-sig-util');
const { Op } = require('sequelize');
const { AuthToken, MessageForSign } = require('../db/models');
const getRandomString = require('../utils/getRandomString');
const authConfig = require('../config/auth');

const createToken = async ({ ip, userId, transaction }) => {
  const token = `${getRandomString(70)}${Date.now()}${getRandomString(50)}`;

  const authToken = await AuthToken.create(
    {
      token,
      authIpAddress: ip,
      UserId: userId,
    },
    {
      transaction,
    },
  );

  return authToken.token;
};

const createMessageForSign = async ({ address, userId, transaction }) => {
  let message = 'Sign in to the app\n\n';
  message += `Address: ${address}\n`;
  message += `Timestamp: ${Date.now()}\n`;
  message += `Nonce: ${getRandomString(20)}\n`;

  const messageForSign = await MessageForSign.create({ address, message, UserId: userId }, { transaction });

  return messageForSign.message;
};

const getUserIdByToken = async ({ token, transaction }) => {
  const authToken = await AuthToken.findOne({
    where: {
      token,
      isCanceled: false,
    },
    attributes: ['UserId'],
    transaction,
  });

  if (authToken) {
    authToken.lastRequestAt = Date.now();
    await authToken.save({ transaction });

    return authToken.UserId;
  }

  return null;
};

const isValidSignature = ({ address, signature, messageForSign }) => {
  if (!address || !signature || !messageForSign) return false;

  const signingAddress = recoverPersonalSignature({
    data: messageForSign,
    signature,
  });

  if (!signingAddress || typeof signingAddress !== 'string') return false;

  return signingAddress.toLowerCase() === address.toLowerCase();
};

const auth = async ({ address, signature, ip, transaction }) => {
  const messagesForSign = await MessageForSign.findAll({
    where: {
      address,
      createdAt: {
        [Op.gte]: new Date(Date.now() - authConfig.timeToSign), // >= current time - time to sign
      },
      attributes: ['message', 'UserId'],
      wasUsed: false,
    },
    transaction,
  });

  const messageForSign = messagesForSign.find(({ message }) =>
    isValidSignature({ address, signature, messageForSign: message }),
  );

  messageForSign.wasUsed = true;

  const token = await createToken({ ip, userId: messageForSign.UserId, transaction });
  await messageForSign.save({ transaction });

  return token;
};

const service = {
  auth,
  getUserIdByToken,
  createMessageForSign,
};

module.exports = service;
