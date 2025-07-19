// middleware/currencyMiddleware.js
const { supportedCurrencies } = require('../utils/currency');

module.exports = function currencyMiddleware(req, res, next) {
  const currency = req.headers['x-currency'] || 'BRL';
  req.currency = supportedCurrencies.includes(currency) ? currency : 'BRL';
  next();
};
