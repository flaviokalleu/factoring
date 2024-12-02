import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Importe o contexto de autenticação

function Cobranca() {
  const { getValidToken } = useAuth(); // Use a função de pegar o token válido
  const [clientesDevedores, setClientesDevedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null); // Para armazenar os detalhes do cliente selecionado

  // Função para buscar clientes com pagamento pendente
  // Função para buscar clientes com pagamento pendente
const fetchClientesDevedores = async () => {
  setLoading(true);
  try {
    const token = await getValidToken(); // Obter o token válido

    if (!token) {
      throw new Error('Token não fornecido ou expirado');
    }

    const response = await fetch('http://localhost:5000/api/clients/atrasado', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Passando o token no cabeçalho
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar clientes atrasados');
    }

    const data = await response.json();

    // Filtra clientes com dias de atraso maior que zero
    const clientesComAtraso = data.filter((cliente) => calcularDiasAtraso(cliente.dataEmprestimo) > 0);

    setClientesDevedores(clientesComAtraso);
  } catch (error) {
    console.error('Erro ao buscar clientes atrasados:', error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchClientesDevedores();
  }, []);

  // Função para formatar valores em reais
  const formatarMoeda = (valor) => {
    return `R$ ${(valor / 1).toFixed(2).replace('.', ',')}`;
  };

  // Função para calcular dias de atraso
  const calcularDiasAtraso = (dataEmprestimo) => {
    const hoje = new Date();
    const dataEmprestimoDate = new Date(dataEmprestimo);
    const diffTime = hoje - dataEmprestimoDate;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  // Função para gerar o link de notificação via WhatsApp
  const notificarCliente = (cliente) => {
    const numeroWhatsApp = cliente.telefone; // Usando o telefone para o WhatsApp
    const mensagem = `Olá ${cliente.nome}, estamos entrando em contato para informar que há um pagamento pendente no valor de ${formatarMoeda(cliente.totalReceber)}. Por favor, regularize sua pendência o quanto antes.`;

    // Gerar o link para o WhatsApp
    const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

    // Redirecionar o usuário para o WhatsApp
    window.open(linkWhatsApp, '_blank');
  };

  // Função para abrir os detalhes do cliente
  const openClientDetails = (cliente) => {
    setSelectedClient(cliente);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8 mt-16"> {/* Adicionando espaçamento superior mt-16 */}
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap">
          
          <div className="flex items-center space-x-4 w-full sm:w-auto mt-4 sm:mt-0">
            <span className="text-lg text-white">
              Total de Clientes em Atraso: {clientesDevedores.length}
            </span>
            <span className="text-red-500 font-bold">⚠️</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : clientesDevedores.length === 0 ? (
          <div className="bg-green-600 text-white p-6 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Excelente!</h2>
            <p>Não há clientes com pagamentos pendentes neste momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="md:col-span-2 xl:col-span-2 bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="p-4 text-left text-white">Nome</th>
                    <th className="p-4 text-center text-white">Valor Pendente</th>
                    <th className="p-4 text-center text-white">Dias em Atraso</th>
                    <th className="p-4 text-center text-white">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesDevedores.map((cliente) => (
                    <tr 
                      key={cliente.id} 
                      className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
                      onClick={() => openClientDetails(cliente)}
                    >
                      <td className="p-4 text-white">{cliente.nome}</td>
                      <td className="p-4 text-center text-red-400 font-semibold">
                        {formatarMoeda(cliente.totalReceber)}
                      </td>
                      <td className="p-4 text-center text-yellow-400">
                        {calcularDiasAtraso(cliente.dataEmprestimo)} dias
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex space-x-2 justify-center">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              notificarCliente(cliente);
                            }} 
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
                          >
                            📨
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`tel:${cliente.telefone}`, '_blank');
                            }} 
                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors"
                          >
                            📞
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-2xl p-6">
              {selectedClient ? (
                <div className="text-white">
                  <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">
                    Detalhes do Cliente
                  </h2>
                  <div className="space-y-3">
                    <p><strong>Nome:</strong> {selectedClient.nome}</p>
                    <p><strong>Telefone:</strong> {selectedClient.telefone}</p>
                    <p><strong>Valor Total:</strong> {formatarMoeda(selectedClient.totalReceber)}</p>
                    <p><strong>Data do Empréstimo:</strong> {new Date(selectedClient.dataEmprestimo).toLocaleDateString()}</p>
                    <p className="flex items-center">
                      <span className="mr-2 text-yellow-400">⏰</span>
                      <strong>Dias em Atraso:</strong> {calcularDiasAtraso(selectedClient.dataEmprestimo)} dias
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  Selecione um cliente para ver detalhes
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cobranca;
