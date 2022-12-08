class WithdrawalError extends Error {
  constructor(message) {
    super(message);
    this.name = 'WithdrawalError';
  }
}

module.exports = WithdrawalError;
