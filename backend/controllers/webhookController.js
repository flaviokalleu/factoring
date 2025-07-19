// controllers/webhookController.js
const Webhook = require('../models/Webhook');

async function triggerWebhook(companyId, event, payload) {
  const webhooks = await Webhook.findAll({ where: { companyId, event, active: true } });
  for (const hook of webhooks) {
    // Exemplo: disparar requisição HTTP
    require('axios').post(hook.url, payload).catch(() => {});
  }
}

module.exports = { triggerWebhook };
