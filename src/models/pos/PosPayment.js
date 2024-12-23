/* eslint-disable */

export const PM_TYPES = {
  BRAINTREE: 1,
  CASH: 2,
  CARD_SELECTOR: 2.5,
  DEBIT_CARD: 3,
  CREDIT_CARD: 4,
  CHECK: 5,
  TRANSFER: 6,
};


export class PosPayment {
  constructor(paymentAmount, paymentMethod) {
    /** @type {number} */
    this.paymentAmount = paymentAmount;

    /** @type {number} */
    this.paymentMethod = paymentMethod;

    /** @type {string} */
    this.bankName = '';

    /** @type {string} */
    this.confirmationNumber = '';

    /** @type {string} */
    this.cardLastDigits = '';

    /** @type {number} */
    this.change = 0;
  }

  get code() {
    const bankName = this.bankName ?? '';
    const confirmationNumber = this.confirmationNumber ?? '';
    const cardLastDigits = this.cardLastDigits ?? '';

    return `change=${this.change};`
      + `bank_name=${bankName};`
      + `confirmation_number=${confirmationNumber};`
      + `cardLastDigits=${cardLastDigits}`;
  }
}
