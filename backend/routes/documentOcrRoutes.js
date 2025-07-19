// routes/documentOcrRoutes.js
const express = require('express');
const { validateDocument } = require('../controllers/documentOcrController');
const router = express.Router();

router.post('/validate', async (req, res) => {
  try {
    const { documentId } = req.body;
    const doc = await validateDocument(documentId);
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Erro na validação do documento' });
  }
});

module.exports = router;
