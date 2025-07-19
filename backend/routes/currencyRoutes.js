// routes/currencyRoutes.js
const express = require('express');
const { convert } = require('../controllers/currencyController');
const router = express.Router();

router.get('/convert', async (req, res) => {
  try {
    const { value, from, to, rate } = req.query;
    const result = await convert(Number(value), from, to, Number(rate));
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: 'Erro na conversão de moeda' });
  }
});

module.exports = router;
