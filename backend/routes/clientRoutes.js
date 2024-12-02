const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth'); // Middleware de autenticação
const ClientController = require('../controllers/clientController'); // Controller para os clientes
const { Client, HistoricoCliente } = require('../models');
const { Op } = require('sequelize');

// Função para calcular a data de vencimento
const calcularDataVencimento = (dataEmprestimo) => {
  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth();

  let dataVencimento = new Date(dataEmprestimo);
  dataVencimento.setFullYear(anoAtual);
  dataVencimento.setMonth(mesAtual);

  // Se a data de vencimento calculada já passou neste mês, usar o próximo mês
  if (dataVencimento < hoje) {
    dataVencimento.setMonth(mesAtual + 1);
  }

  return dataVencimento;
};

// Função para verificar se o cliente está em atraso ou faltando 3 dias para o vencimento
const verificarAtraso = async (cliente) => {
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  // Calcular a data de vencimento
  const dataVencimento = calcularDataVencimento(cliente.dataEmprestimo);

  // Verificar se a data de vencimento está dentro de 3 dias
  const tresDiasAntes = new Date(dataVencimento);
  tresDiasAntes.setDate(dataVencimento.getDate() - 3); // 3 dias antes da data de vencimento

  // Buscar histórico de ações do cliente para o mês atual
  const historico = await HistoricoCliente.findAll({
    where: {
      clienteId: cliente.id,
      data: {
        [Op.gte]: new Date(anoAtual, mesAtual, 1),
        [Op.lt]: new Date(anoAtual, mesAtual + 1, 1),
      }
    }
  });

  // Verificar se houve pagamento ou ação de "Só Juros" ou "Pg. Parcial" neste mês
  const pagamentoEsteMes = historico.some(entry => ['Quitado', 'Só Juros', 'Pg. Parcial'].includes(entry.acao));

  // Verificar se o cliente está quitado ou com valor devido igual a 0,00
  const estaQuitado = cliente.totalReceber <= 0;

  // Verificar se a data de vencimento está dentro de 3 dias
  const falta3DiasParaVencimento = hoje >= tresDiasAntes && hoje < dataVencimento;

  // Retorna se o cliente está em atraso ou falta 3 dias para o vencimento
  return (!estaQuitado && cliente.totalReceber > 0 && !pagamentoEsteMes) || falta3DiasParaVencimento;
};

// Rota para buscar clientes atrasados
router.get('/atrasado', async (req, res) => {
  try {
    // Buscar todos os clientes
    const clientes = await Client.findAll();

    // Filtrar clientes que estão em atraso ou faltando 3 dias para o pagamento
    const clientesAtrasados = [];
    for (const cliente of clientes) {
      const estaAtrasado = await verificarAtraso(cliente);
      if (estaAtrasado) {
        clientesAtrasados.push(cliente);
      }
    }

    res.json(clientesAtrasados);
  } catch (error) {
    console.error('Erro ao buscar clientes atrasados:', error);
    res.status(500).json({ error: 'Erro ao buscar clientes atrasados' });
  }
});




// Rota para obter todos os clientes
router.get('/:userId', authenticateToken, ClientController.getAllClients);

// Rota para adicionar um cliente
router.post('/', authenticateToken, ClientController.addClient);

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { jurosReceber, totalReceber } = req.body;

  try {
    const cliente = await Client.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    // Atualizar os campos necessários
    if (jurosReceber !== undefined) cliente.jurosReceber = jurosReceber;
    if (totalReceber !== undefined) cliente.totalReceber = totalReceber;

    await cliente.save();

    res.json(cliente);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
});




module.exports = router;
