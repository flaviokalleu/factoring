const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/dashboardController');
const authenticateToken = require('../middleware/auth'); // Removido as chaves para importar corretamente

// Filtro avançado: empresa, status, período
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const { companyId, status, startDate, endDate } = req.query;
    const filters = {};
    if (companyId) filters.companyId = companyId;
    if (status) filters.status = status;
    if (startDate && endDate) filters.createdAt = { $between: [startDate, endDate] };
    // Chame o controller passando os filtros
    const data = await getDashboardData(filters);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar dados do dashboard' });
  }
});

module.exports = router;
