const express = require('express');
const router = express.Router();
const { HistoricoCliente, Client } = require('../models'); // Certifique-se de importar Client aqui

// Rota para registrar o histórico
router.post('/', async (req, res) => {
  const { clienteId, acao, valor, observacao } = req.body;

  try {
    // Criação do histórico
    const historico = await HistoricoCliente.create({
      clienteId,
      acao,
      valor,
      observacao,
    });
    res.status(201).json(historico);
  } catch (error) {
    console.error('Erro ao registrar histórico:', error);
    res.status(500).json({ error: 'Erro ao registrar histórico' });
  }
});

// Rota para obter os históricos do usuário
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // 1. Buscar todos os clientes associados ao userId
    const clients = await Client.findAll({
      where: { userId },
      attributes: ['id', 'nome', 'cpf'], // Buscar os campos necessários
    });

    if (!clients.length) {
      return res.status(404).json({ error: 'Nenhum cliente encontrado para este usuário' });
    }

    // 2. Para cada cliente, buscar o histórico associado
    const histories = await Promise.all(clients.map(async (client) => {
      const clientHistory = await HistoricoCliente.findAll({
        where: { clienteId: client.id },
        order: [['data', 'DESC']], // Ordenar pelo campo 'data'
        attributes: ['acao', 'data', 'valor', 'observacao'], // Você pode escolher os campos do histórico que deseja retornar
      });
      return {
        client: {
          id: client.id,
          nome: client.nome,
          cpf: client.cpf,
        },
        history: clientHistory,
      };
    }));

    // Retornar todos os clientes e seus históricos
    res.status(200).json(histories);
  } catch (error) {
    console.error('Error fetching client histories:', error);
    res.status(500).json({ error: 'Error fetching client histories' });
  }
});

router.get('/user/:userId/lista-negra', async (req, res) => {
  const { userId } = req.params;  // Pegando o userId da URL
  try {
    // Primeiramente, vamos buscar o cliente vinculado ao userId
    const cliente = await Client.findOne({
      where: { userId },
    });

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado para esse usuário' });
    }

    // Agora que temos o cliente, buscamos os históricos com a ação 'Lista Negra' para esse cliente
    const clientesHistorico = await HistoricoCliente.findAll({
      where: {
        clienteId: cliente.id,  // Usamos o clienteId para filtrar
        acao: 'Lista Negra',    // Filtramos pela ação 'Lista Negra'
      },
      include: [
        {
          model: Client,
          as: 'client',
          attributes: [
            'id', 'nome', 'cpf', 'telefone', 'endereco', 'observacoes', 
            'valorPegado', 'juros', 'totalReceber', 'dataEmprestimo', 
            'porcentagem', 'afiliado', 'jurosReceber', 'dataUltimaAtualizacao'
          ], 
        },
      ],
    });

    if (clientesHistorico.length === 0) {
      return res.status(404).json({ message: 'Nenhum cliente encontrado na lista negra' });
    }

    const resultado = clientesHistorico.map((historico) => ({
      ...historico.dataValues,
      client: historico.client.dataValues,
    }));

    res.json(resultado);
  } catch (error) {
    console.error('Erro ao buscar clientes na lista negra:', error);
    res.status(500).json({ message: 'Erro ao buscar clientes na lista negra' });
  }
});



module.exports = router;
