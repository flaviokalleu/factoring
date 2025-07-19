// routes/publicApiRoutes.js
const express = require('express');
const router = express.Router();

// Exemplo de endpoint público
router.get('/status', (req, res) => {
  res.json({ status: 'API pública operacional' });
});

module.exports = router;
