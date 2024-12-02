import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import Cookies from 'js-cookie';

function ListaClientes() {
  const { user, loading: authLoading } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  

  // Mantém as funções de token existentes (isTokenExpired, getRemainingTime, etc.)
  const isTokenExpired = (token) => {
    if (!token) return true;

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(window.atob(base64));
    const expirationDate = decoded?.exp * 1000;

    return expirationDate < Date.now();
  };

  const getUserIdFromToken = (token) => {
    if (!token) return null;

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(window.atob(base64));
    return decoded?.id;
  };

  const renewToken = async () => {
    try {
      const refreshToken = Cookies.get('refreshToken');
      const userId = Cookies.get('userId');

      if (!refreshToken || !userId) {
        throw new Error('Refresh token ou ID de usuário não encontrados nos cookies');
      }

      const response = await axios.post('http://localhost:5000/api/auth/refresh-token', {
        userId,
        refreshToken,
      });

      const { accessToken, expiresIn } = response.data;

      const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
      Cookies.set('accessToken', accessToken, { expires: expirationDate });

      return accessToken;
    } catch (error) {
      console.error('Erro ao renovar o token:', error);
      return null;
    }
  };

  // Função para buscar clientes
  const fetchClientes = async (token, userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/clients/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      setClientes(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar os clientes.');
      setLoading(false);
    }
  };

  // Efeito para buscar clientes
  useEffect(() => {
    if (authLoading) return;
    const token = Cookies.get('accessToken');

    if (token) {
      const userIdFromToken = getUserIdFromToken(token);

      if (!userIdFromToken) {
        setError('Não foi possível obter o ID do usuário a partir do token.');
        setLoading(false);
        return;
      }

      if (isTokenExpired(token)) {
        renewToken().then(newToken => {
          if (newToken) {
            const newUserId = getUserIdFromToken(newToken);
            fetchClientes(newToken, newUserId);
          }
        });
      } else {
        fetchClientes(token, userIdFromToken);
      }
    } else {
      setError('Token de acesso não encontrado.');
      setLoading(false);
    }
  }, [authLoading]);

  // Função de ação melhorada
  const handleAcao = async (cliente, acao, valor = null, observacao = '') => {
    try {
      const token = Cookies.get('accessToken');
      if (!token) {
        alert('Token de acesso não encontrado.');
        return;
      }
  
      let updatedCliente = { ...cliente };
      let novoTotalReceber = cliente.totalReceber;
      let novoJurosReceber = cliente.jurosReceber;
      let descricaoObservacao = observacao;
      let valorAntesQuitacao = null;
  
      if (acao === 'Só Juros') {
        novoTotalReceber = Math.max(0, cliente.totalReceber - cliente.jurosReceber);
        novoJurosReceber = calcularNovosJuros(novoTotalReceber, cliente.porcentagem);
        updatedCliente = {
          ...cliente,
          jurosReceber: novoJurosReceber,
          totalReceber: novoTotalReceber,
        };
        descricaoObservacao += ` Só Juros: Total a receber atualizado para R$ ${novoTotalReceber.toFixed(2)}.`;
      } else if (acao === 'Pg. Parcial' && valor !== null) {
        novoTotalReceber = Math.max(0, cliente.totalReceber - valor);
        novoJurosReceber = calcularNovosJuros(novoTotalReceber, cliente.porcentagem);
        updatedCliente = {
          ...cliente,
          totalReceber: novoTotalReceber,
          jurosReceber: novoJurosReceber,
        };
        descricaoObservacao += ` Pagamento Parcial de R$ ${valor.toFixed(2)}: Total a receber atualizado para R$ ${novoTotalReceber.toFixed(2)}.`;
      } else if (acao === 'Quitado') {
        valorAntesQuitacao = cliente.totalReceber;
        updatedCliente = {
          ...cliente,
          totalReceber: 0,
          jurosReceber: 0,
        };
        descricaoObservacao += ` Dívida quitada. Valor antes da quitação: R$ ${valorAntesQuitacao.toFixed(2)}.`;
      } else if (acao === 'Não Pagou') {
        descricaoObservacao += ' Cliente não pagou.';
        return;
      }
  
      // Registrar histórico da ação com o valor final e a observação detalhada
      await axios.post(
        'http://localhost:5000/api/historico',
        {
          clienteId: cliente.id,
          acao,
          valor: acao === 'Quitado' ? valorAntesQuitacao : updatedCliente.totalReceber, // Valor antes da quitação ou valor final após a ação
          observacao: descricaoObservacao,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Atualizar o cliente no banco de dados
      await axios.put(
        `http://localhost:5000/api/clients/${cliente.id}`,
        {
          jurosReceber: updatedCliente.jurosReceber,
          totalReceber: updatedCliente.totalReceber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Atualizar o estado local dos clientes
      setClientes(prevClientes =>
        prevClientes.map(c => c.id === cliente.id ? updatedCliente : c)
      );
  
      alert(`Ação "${acao}" registrada com sucesso.`);
    } catch (err) {
      console.error('Erro ao registrar a ação:', err);
      alert('Erro ao registrar a ação.');
    }
  };
  
  const calcularNovosJuros = (totalReceber, porcentagem) => {
    return totalReceber * (porcentagem / 100);
  };
  
  
  

  // Funções de confirmação de ação
  const confirmAcao = (cliente, acao) => {
    switch(acao) {
      case 'Quitado':
        if (window.confirm('Você tem certeza que deseja marcar como Quitado?')) {
          handleAcao(cliente, acao);
        }
        break;
  
      case 'Só Juros':
        if (window.confirm('Você tem certeza que deseja marcar como Só Juros?')) {
          handleAcao(cliente, acao);
        }
        break;
  
      case 'Pg. Parcial':
        const valorPago = window.prompt('Qual valor foi pago?');
        if (valorPago && !isNaN(parseFloat(valorPago))) {
          const valorPagoNumerico = parseFloat(valorPago);
          const valorRestante = cliente.totalReceber - valorPagoNumerico;
  
          // Ajustando a formatação de moeda e passando as informações para a função
          handleAcao(
            cliente,
            acao,
            valorPagoNumerico,
            `Valor pago: ${formatCurrency(valorPagoNumerico)}. Valor restante: ${formatCurrency(valorRestante)}`
          );
        } else {
          alert('Por favor, insira um valor válido.');
        }
        break;
  
      case 'Não Pagou':
        if (window.confirm('Você tem certeza que deseja marcar como Não Pagou?')) {
          handleAcao(cliente, acao);
        }
        break;
  
      case 'Lista Negra':
        if (window.confirm('Você tem certeza que deseja adicionar este cliente à Lista Negra?')) {
          handleAcao(cliente, acao);
        }
        break;
  
      default:
        console.log('Ação não reconhecida');
        break;
    }
  };
  

  // Função para notificar via WhatsApp
  const handleNotificar = (cliente) => {
    const mensagem = `Olá ${cliente.nome},\n\nVocê possui um saldo devedor no valor de ${formatCurrency(cliente.totalReceber)}. Por favor, entre em contato para regularizar sua situação.`;
    const numeroWhatsapp = cliente.telefone.replace(/\D/g, '');
    const urlWhatsApp = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensagem)}`;
    window.open(urlWhatsApp, '_blank');
  };

  // Formatação de moeda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 1);
  };

  // Funções de filtragem e pesquisa
  const clientesFiltrados = useMemo(() => {
    return clientes.filter(cliente => {
      const matchSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatus = filtroStatus === 'Todos' || 
        (filtroStatus === 'Pendente' && cliente.totalReceber > 0) ||
        (filtroStatus === 'Quitado' && cliente.totalReceber === 0);
  
      // Excluir clientes com totalReceber igual a 0 da lista
      return matchSearch && matchStatus && cliente.totalReceber > 0;
    });
  }, [clientes, searchTerm, filtroStatus]);
  

  // Renderização
  if (authLoading || loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8 md:p-8 pt-32">
  <div className="max-w-7xl mx-auto">
    {/* Cabeçalho */}
    <header className="mb-8 text-center md:text-left">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
        Clientes
      </h2>
      <p className="text-gray-300 max-w-xl mx-auto md:mx-0">
        Gerencie os clientes e suas informações de empréstimo
      </p>
    </header>

    {/* Filtros e Ferramentas */}
    <div className="top-6 mb-6 flex flex-col md:flex-row gap-4">
      <div className="flex-grow">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Buscar cliente..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <select 
          value={filtroStatus} 
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 transition duration-300"
        >
          <option value="Todos">Todos os Status</option>
          <option value="Pendente">Pendentes</option>
          <option value="Quitado">Quitados</option>
        </select>
      </div>
    </div>

    {/* Tabela de Clientes */}
    <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              {['Nome', 'Saldo Devedor', 'Juros', 'Data Empréstimo', 'Ações'].map((header) => (
                <th 
                  key={header} 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map((cliente) => (
              <React.Fragment key={cliente.id}>
                <tr 
                  className={`
                    hover:bg-gray-700 transition duration-200 
                    ${cliente.totalReceber === 0 ? 'opacity-60 bg-gray-900' : ''} 
                    ${expandedId === cliente.id ? 'bg-gray-700' : ''}
                  `}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full mr-4 flex items-center justify-center ${cliente.totalReceber > 0 ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'}`}>
                        {cliente.nome.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-white">{cliente.nome}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-red-400">
                    {formatCurrency(cliente.totalReceber)}
                  </td>
                  <td className="px-6 py-4 text-yellow-400">
                    {formatCurrency(cliente.jurosReceber)}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
  {new Date(cliente.dataEmprestimo).toLocaleString('pt-BR', {
    weekday: 'long', // Dia da semana
    year: 'numeric', // Ano completo
    month: 'long', // Mês por extenso
    day: 'numeric', // Dia numérico
    hour: 'numeric', // Hora
    minute: 'numeric', // Minuto
    second: 'numeric', // Segundo
    hour12: true, // Formato de 12 horas
  })}
</td>
<td className="px-6 py-4">
  <div className="flex space-x-2">
    {/* Botão 'Só Juros' */}
    <button
      disabled={cliente.totalReceber === 0}
      onClick={(e) => {
        e.stopPropagation();
        confirmAcao(cliente, 'Só Juros');
      }}
      className="px-3 py-1 rounded-md text-xs font-semibold bg-yellow-500 text-white hover:bg-yellow-600"
    >
      Só Juros
    </button>
    
    {/* Botão 'Pg. Parcial' */}
    <button
      disabled={cliente.totalReceber === 0}
      onClick={(e) => {
        e.stopPropagation();
        confirmAcao(cliente, 'Pg. Parcial');
      }}
      className="px-3 py-1 rounded-md text-xs font-semibold bg-blue-500 text-white hover:bg-blue-600"
    >
      Pg. Parcial
    </button>
    
    {/* Botão 'Quitado' */}
    <button
      disabled={cliente.totalReceber === 0}
      onClick={(e) => {
        e.stopPropagation();
        confirmAcao(cliente, 'Quitado');
      }}
      className="px-3 py-1 rounded-md text-xs font-semibold bg-green-500 text-white hover:bg-green-600"
    >
      Quitado
    </button>

    {/* Botão 'Não Pagou' */}
    <button
      disabled={cliente.totalReceber === 0}
      onClick={(e) => {
        e.stopPropagation();
        confirmAcao(cliente, 'Não Pagou');
      }}
      className="px-3 py-1 rounded-md text-xs font-semibold bg-red-500 text-white hover:bg-red-600"
    >
      Não Pagou
    </button>

    {/* Botão 'Lista Negra' */}
    <button
      disabled={cliente.totalReceber === 0}
      onClick={(e) => {
        e.stopPropagation();
        confirmAcao(cliente, 'Lista Negra');
      }}
      className="px-3 py-1 rounded-md text-xs font-semibold bg-gray-500 text-white hover:bg-gray-600"
    >
      Lista Negra
    </button>
  </div>
</td>

                </tr>
                
                {/* Detalhes Expandidos */}
                {expandedId === cliente.id && (
                  <tr>
                    <td colSpan="5" className="bg-gray-900 p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Informações Pessoais */}
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-4">Informações Pessoais</h4>
                          <div className="space-y-2">
                            <p><strong className="text-gray-400">CPF:</strong> {cliente.cpf}</p>
                            <p><strong className="text-gray-400">Endereço:</strong> {cliente.endereco}</p>
                            <p><strong className="text-gray-400">Valor Emprestado:</strong> {formatCurrency(cliente.valorPegado)}</p>
                          </div>
                        </div>
                        
                        {/* Detalhes do Empréstimo */}
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-4">Detalhes do Empréstimo</h4>
                          <div className="space-y-2">
                            <p><strong className="text-gray-400">Porcentagem:</strong> {cliente.porcentagem}%</p>
                            <p><strong className="text-gray-400">Afiliado:</strong> {cliente.afiliado}</p>
                            <p><strong className="text-gray-400">Data Última Atualização:</strong> {cliente.dataUltimaAtualizacao}</p>
                          </div>
                        </div>

                        {/* Observações */}
                        <div className="md:col-span-2">
                          <h4 className="text-lg font-semibold text-white mb-4">Observações</h4>
                          <p className="text-gray-400">{cliente.observacoes || 'Nenhuma observação.'}</p>
                        </div>

                        <div className="md:col-span-2 flex justify-between items-center mt-4">
                          <button 
                            onClick={() => handleNotificar(cliente)}
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                          >
                            Notificar via WhatsApp
                          </button>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cliente.totalReceber === 0 ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                            {cliente.totalReceber === 0 ? 'Quitado' : 'Pendente'}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Estado Vazio */}
      {clientesFiltrados.length === 0 && (
        <div className="text-center py-12 bg-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <p className="text-gray-400">Nenhum cliente encontrado</p>
        </div>
      )}
    </div>
  </div>
</div>

  );
}

export default ListaClientes;