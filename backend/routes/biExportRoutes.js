// routes/biExportRoutes.js
const express = require('express');
const { exportGraphs } = require('../controllers/biExportController');
const router = express.Router();

router.get('/:companyId', async (req, res) => {
  try {
    const filePath = await exportGraphs(req.params.companyId);
    res.download(filePath);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao exportar gráficos' });
  }
});

module.exports = router;
