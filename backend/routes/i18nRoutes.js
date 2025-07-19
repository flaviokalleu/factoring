// routes/i18nRoutes.js
const express = require('express');
const { translate } = require('../controllers/i18nController');
const router = express.Router();

router.get('/translate', async (req, res) => {
  try {
    const { lang, key } = req.query;
    const result = await translate(lang, key);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: 'Erro na tradução' });
  }
});

module.exports = router;
