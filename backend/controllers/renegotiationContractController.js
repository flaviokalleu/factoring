// controllers/renegotiationContractController.js
const Renegotiation = require('../models/Renegotiation');

async function generateContract(renegotiationId) {
  const reneg = await Renegotiation.findByPk(renegotiationId);
  if (!reneg) throw new Error('Renegociação não encontrada');
  // Simulação de contrato
  const contract = `Contrato de Renegociação\nCliente: ${reneg.clientId}\nValor Original: R$${reneg.originalValue}\nNovo Valor: R$${reneg.newValue}\nParcelas: ${reneg.installments}\nDesconto: ${reneg.discount * 100}%\nStatus: ${reneg.status}`;
  return contract;
}

module.exports = { generateContract };
