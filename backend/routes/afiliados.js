// routes/afiliadosRoutes.js
const express = require('express');
const router = express.Router();
const { Afiliado } = require('../models');

// Rota para obter todos os afiliados
router.get('/', async (req, res) => {
  try {
    const afiliados = await Afiliado.findAll();
    res.json(afiliados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar afiliados' });
  }
});

// Rota para criar um novo afiliado
router.post('/', async (req, res) => {
  try {
    const { nome, telefone, endereco, observacoes, comissao, total_a_receber, userId } = req.body;
    const novoAfiliado = await Afiliado.create({
      nome,
      telefone,
      endereco,
      observacoes,
      comissao,
      total_a_receber,
      userId,
    });
    res.status(201).json(novoAfiliado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar afiliado' });
  }
});

// Rota para obter um afiliado específico
// Rota para obter todos os afiliados de um usuário específico
router.get('/:userId', async (req, res) => {
    try {
      const { userId } = req.params;  // Pega o userId dos parâmetros da requisição
      const afiliados = await Afiliado.findAll({
        where: {
          userId: userId  // Filtra os afiliados com base no userId
        }
      });
      if (!afiliados || afiliados.length === 0) {
        return res.status(404).json({ error: 'Nenhum afiliado encontrado para este usuário' });
      }
      res.json(afiliados);  // Retorna a lista de afiliados do usuário
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar afiliados' });
    }
  });
  

// Rota para atualizar um afiliado
router.put('/:id', async (req, res) => {
  try {
    const { nome, telefone, endereco, observacoes, comissao, total_a_receber, userId } = req.body;
    const afiliado = await Afiliado.findByPk(req.params.id);

    if (!afiliado) {
      return res.status(404).json({ error: 'Afiliado não encontrado' });
    }

    afiliado.nome = nome || afiliado.nome;
    afiliado.telefone = telefone || afiliado.telefone;
    afiliado.endereco = endereco || afiliado.endereco;
    afiliado.observacoes = observacoes || afiliado.observacoes;
    afiliado.comissao = comissao || afiliado.comissao;
    afiliado.total_a_receber = total_a_receber || afiliado.total_a_receber;
    afiliado.userId = userId || afiliado.userId;

    await afiliado.save();
    res.json(afiliado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar afiliado' });
  }
});

// Rota para deletar um afiliado
router.delete('/:id', async (req, res) => {
  try {
    const afiliado = await Afiliado.findByPk(req.params.id);

    if (!afiliado) {
      return res.status(404).json({ error: 'Afiliado não encontrado' });
    }

    await afiliado.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar afiliado' });
  }
});

module.exports = router;
