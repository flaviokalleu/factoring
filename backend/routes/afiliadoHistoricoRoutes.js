// routes/afiliadoHistoricoRoutes.js

const express = require('express');
const router = express.Router();
const { criarHistoricoAfiliado,buscarHistoricoAfiliado } = require('../controllers/afiliadoHistoricoController');

// Rota para criar histórico de afiliado
router.post('/afiliadoHistorico', criarHistoricoAfiliado);
router.get('/afiliadoHistorico/:afiliadoId', buscarHistoricoAfiliado);

module.exports = router;
