// routes/documentRoutes.js
const express = require('express');
const { uploadDocument } = require('../controllers/documentController');
const router = express.Router();

router.post('/upload', async (req, res) => {
  try {
    const { clientId, type, url } = req.body;
    const doc = await uploadDocument(clientId, type, url);
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer upload de documento' });
  }
});

module.exports = router;
