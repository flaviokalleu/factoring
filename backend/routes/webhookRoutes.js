// routes/webhookRoutes.js
const express = require('express');
const { triggerWebhook } = require('../controllers/webhookController');
const router = express.Router();

router.post('/trigger', async (req, res) => {
  try {
    const { companyId, event, payload } = req.body;
    await triggerWebhook(companyId, event, payload);
    res.json({ message: 'Webhooks disparados.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao disparar webhooks' });
  }
});

module.exports = router;
