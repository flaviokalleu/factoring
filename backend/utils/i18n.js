// utils/i18n.js
const messages = {
  pt: {
    welcome: 'Bem-vindo!',
    paymentDue: 'Pagamento pendente',
  },
  en: {
    welcome: 'Welcome!',
    paymentDue: 'Payment due',
  }
};

function getMessage(lang, key) {
  return messages[lang]?.[key] || messages['pt'][key];
}

module.exports = { getMessage };
