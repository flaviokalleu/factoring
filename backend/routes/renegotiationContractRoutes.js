// routes/renegotiationContractRoutes.js
const express = require('express');
const { generateContract } = require('../controllers/renegotiationContractController');
const router = express.Router();

router.get('/:renegotiationId', async (req, res) => {
  try {
    const contract = await generateContract(req.params.renegotiationId);
    res.json({ contract });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar contrato' });
  }
});

module.exports = router;
