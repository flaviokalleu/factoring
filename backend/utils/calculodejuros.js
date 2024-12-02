// backend/utils/calculodejuros.js
const cron = require('node-cron');
const { Client } = require('../models'); // Importa o modelo do Sequelize para interagir diretamente com o banco
const moment = require('moment');  // Para manipulação de datas

// Função para calcular juros com precisão ajustada
const calcularJuros = (totalReceber, juros) => {
  // Converte para número, garantindo um valor numérico
  totalReceber = Number(totalReceber || 0);
  juros = Number(juros || 10); // Usa 10 como padrão se não for especificado
  
  // Verifica se os valores são números válidos
  if (isNaN(totalReceber) || isNaN(juros)) {
    console.error(`Erro de conversão: totalReceber=${totalReceber}, juros=${juros}`);
    return totalReceber;
  }
  
  // Calcula os juros aplicando a porcentagem ao valor total
  const jurosCalculados = totalReceber * (juros / 100);
  
  // O valor final é o valor original mais o juros calculado
  const valorFinal = totalReceber + jurosCalculados;
  
  // Retorna o valor final com 2 casas decimais
  return Number(valorFinal.toFixed(2));
};

// Função para atualizar os juros dos clientes
const atualizarJurosClientes = async () => {
  try {
    // Buscar todos os clientes diretamente no banco de dados
    const clientes = await Client.findAll();
    
    for (let cliente of clientes) {
      // Log para debug
      console.log(`Processando cliente: ${cliente.nome}`);
      console.log(`Dados do cliente:`, JSON.stringify(cliente, null, 2));
      
      // Tratamento seguro para dados
      const totalReceber = Number(cliente.totalReceber || 0);
      const juros = Number(cliente.juros || 10);
      
      // Verificar se os juros já foram aplicados neste mês
      const dataAtual = moment();
      const ultimaAtualizacao = cliente.dataUltimaAtualizacao 
        ? moment(cliente.dataUltimaAtualizacao) 
        : null;
      
      // Se não houver última atualização ou não for no mesmo mês, aplicar juros
      if (!ultimaAtualizacao || ultimaAtualizacao.month() !== dataAtual.month()) {
        // Calcular o novo valor final a receber com os juros
        const novoTotalReceber = calcularJuros(totalReceber, juros);
        
        // Log detalhado do cálculo
        console.log(`Cliente: ${cliente.nome}`);
        console.log(`Total original: R$ ${totalReceber.toFixed(2)}`);
        console.log(`Porcentagem de juros: ${juros}%`);
        console.log(`Juros calculados: R$ ${(novoTotalReceber - totalReceber).toFixed(2)}`);
        console.log(`Novo total: R$ ${novoTotalReceber.toFixed(2)}`);
        
        // Verificar se o novo total é válido
        if (isNaN(novoTotalReceber)) {
          console.error(`Erro no cálculo para o cliente ${cliente.nome}. Novo total a receber: ${novoTotalReceber}`);
          continue; // Ignorar esse cliente e continuar com os outros
        }
        
        // Atualizar o cliente
        await cliente.update({
          totalReceber: novoTotalReceber,
          jurosReceber: novoTotalReceber - totalReceber,
          dataUltimaAtualizacao: dataAtual.toDate()
        });
        
        console.log(`Cliente ${cliente.nome} atualizado com sucesso.`);
      } else {
        console.log(`Cliente ${cliente.nome} já teve juros aplicados neste mês. Ignorando atualização.`);
      }
    }
  } catch (error) {
    console.error('Erro ao atualizar juros dos clientes:', error);
    // Log do erro detalhado para depuração
    console.error('Detalhes do erro:', error.stack);
  }
};

// Configura o cron job para rodar todos os dias à meia-noite
cron.schedule('0 0 * * *', () => {
  console.log('Iniciando cálculo de juros para todos os clientes...');
  atualizarJurosClientes();
});

// Exporta a função para usá-la em outro lugar, se necessário
module.exports = atualizarJurosClientes;