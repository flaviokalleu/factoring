// middleware/i18nMiddleware.js
const { getMessage } = require('../utils/i18n');

module.exports = function i18nMiddleware(req, res, next) {
  const lang = req.headers['x-lang'] || 'pt';
  req.getMessage = (key) => getMessage(lang, key);
  next();
};
