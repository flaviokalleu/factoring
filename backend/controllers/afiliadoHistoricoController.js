// controllers/afiliadoHistoricoController.js
const { AfiliadoHistorico } = require('../models');
const { validationResult } = require('express-validator');

const criarHistoricoAfiliado = async (req, res) => {
  const { afiliadoId, comissao, totalReceber } = req.body;

  // Validações
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Cria o histórico de comissão
    const historico = await AfiliadoHistorico.create({
      afiliadoId,
      comissao,
      totalReceber,
      data: new Date(),
    });

    return res.status(201).json(historico);
  } catch (error) {
    console.error('Erro ao criar histórico:', error);
    return res.status(500).json({ error: 'Erro ao registrar histórico do afiliado' });
  }
};


// Função para buscar o histórico de um afiliado
const buscarHistoricoAfiliado = async (req, res) => {
  const { afiliadoId } = req.params;  // Corrigido para usar afiliadoId

  try {
    // Busca o histórico de um afiliado específico
    const historico = await AfiliadoHistorico.findAll({
      where: { afiliadoId: afiliadoId },
    });

    if (!historico || historico.length === 0) {
      return res.status(404).json({ message: 'Nenhum histórico encontrado para este afiliado' });
    }

    return res.status(200).json(historico);
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    return res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
};


module.exports = { criarHistoricoAfiliado,buscarHistoricoAfiliado };
