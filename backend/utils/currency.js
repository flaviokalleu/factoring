// utils/currency.js
const supportedCurrencies = ['BRL', 'USD', 'EUR'];

function convertCurrency(value, from, to, rate) {
  if (from === to) return value;
  return value * rate;
}

module.exports = { supportedCurrencies, convertCurrency };
