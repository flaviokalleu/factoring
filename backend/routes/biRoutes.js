// routes/biRoutes.js
const express = require('express');
const { createGraph, getGraphs } = require('../controllers/biController');
const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const { companyId, type, config } = req.body;
    const graph = await createGraph(companyId, type, config);
    res.json(graph);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar gráfico' });
  }
});

router.get('/:companyId', async (req, res) => {
  try {
    const graphs = await getGraphs(req.params.companyId);
    res.json(graphs);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar gráficos' });
  }
});

module.exports = router;
