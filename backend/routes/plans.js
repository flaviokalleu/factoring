const express = require('express');
const router = express.Router();
const Plano = require('../models/plano'); // Importando o modelo Plano

// Rota para buscar todos os planos
router.get('/', async (req, res) => {
  try {
    // Buscando todos os planos do banco de dados
    const plans = await Plano.findAll();
    
    // Se não houver planos
    if (plans.length === 0) {
      return res.status(404).json({ message: 'Nenhum plano encontrado' });
    }
    
    // Retorna os planos encontrados
    res.json(plans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar planos' });
  }
});

module.exports = router;
