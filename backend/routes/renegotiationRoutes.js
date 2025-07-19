// routes/renegotiationRoutes.js
const express = require('express');
const { suggestRenegotiation } = require('../controllers/renegotiationController');
const router = express.Router();

router.post('/suggest', async (req, res) => {
  try {
    const { clientId, originalValue, delayDays } = req.body;
    const result = await suggestRenegotiation(clientId, originalValue, delayDays);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao sugerir renegociação' });
  }
});

module.exports = router;
