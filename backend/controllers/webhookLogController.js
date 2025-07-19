// controllers/webhookLogController.js
const Webhook = require('../models/Webhook');

async function getWebhookLogs(companyId) {
  // Simulação de logs
  return [{ event: 'pagamento', status: 'enviado', date: new Date() }];
}

module.exports = { getWebhookLogs };
