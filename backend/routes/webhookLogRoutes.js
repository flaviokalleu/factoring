// routes/webhookLogRoutes.js
const express = require('express');
const { getWebhookLogs } = require('../controllers/webhookLogController');
const router = express.Router();

router.get('/:companyId', async (req, res) => {
  try {
    const logs = await getWebhookLogs(req.params.companyId);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar logs de webhooks' });
  }
});

module.exports = router;
