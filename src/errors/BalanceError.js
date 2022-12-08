class BalanceError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BalanceError';
  }
}

module.exports = BalanceError;
