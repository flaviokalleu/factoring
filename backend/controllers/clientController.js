// controllers/clientController.js
const { Client } = require('../models');

// Função para obter todos os clientes
exports.getAllClients = async (req, res) => {
  try {
    const { userId } = req.params; // Pega o userId dos parâmetros da URL
    const clients = await Client.findAll({ where: { userId } }); // Filtra os clientes pelo userId
    res.json(clients);
  } catch (error) {
    console.error('Erro ao obter os clientes:', error);
    res.status(500).json({ message: 'Erro ao obter os clientes' });
  }
};

// Função para adicionar um cliente
exports.addClient = async (req, res) => {
  const { nome, cpf, telefone, endereco, observacoes, valorPegado, juros, dataEmprestimo, porcentagem, afiliado, jurosReceber, totalReceber } = req.body;
  
  // Log para depuração
  console.log('User ID recebido:', req.userId);
  
  // Verifique se userId está definido
  if (!req.userId) {
    return res.status(401).json({ message: 'Usuário não autenticado' });
  }

  try {
    const client = await Client.create({
      nome,
      cpf,      
      telefone,
      endereco,
      observacoes,
      valorPegado,
      juros,
      dataEmprestimo,
      porcentagem,
      afiliado,
      userId: req.userId,  // Use req.userId diretamente
      jurosReceber,
      totalReceber,
      dataUltimaAtualizacao: new Date(), // Adiciona a data da última atualização
    });
    
    res.status(201).json(client);
  } catch (error) {
    console.error('Erro detalhado:', error);
    res.status(500).json({ 
      message: 'Erro ao adicionar o cliente', 
      errorDetails: error.message,
      errorStack: error.stack
    });
  }
};
