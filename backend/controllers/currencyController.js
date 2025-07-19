// controllers/currencyController.js
const { convertCurrency } = require('../utils/currency');

async function convert(value, from, to, rate) {
  return convertCurrency(value, from, to, rate);
}

module.exports = { convert };
