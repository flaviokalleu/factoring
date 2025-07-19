// controllers/i18nController.js
const { getMessage } = require('../utils/i18n');

async function translate(lang, key) {
  return getMessage(lang, key);
}

module.exports = { translate };
