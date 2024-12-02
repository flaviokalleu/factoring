import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { 
  Phone, 
  MessageCircle, 
  AlertTriangle, 
  Filter, 
  X, 
  Search 
} from 'lucide-react';

function ListaNegra() {
  const [clientesListaNegra, setClientesListaNegra] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user, getValidToken } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = await getValidToken();
        if (token && user) {
          const response = await axios.get(`http://localhost:5000/api/historico/user/${user.userId}/lista-negra`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const listaNegra = response.data
            .filter((historico) => historico.acao === 'Lista Negra')
            .map((historico) => ({
              ...historico,
              client: historico.client,
            }));
          
          setClientesListaNegra(listaNegra);
          setFilteredClientes(listaNegra);
        }
      } catch (error) {
        console.error('Erro ao buscar clientes na lista negra:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [getValidToken, user]);

  // Search and filter functionality
  useEffect(() => {
    if (searchTerm) {
      const filtered = clientesListaNegra.filter(historico => 
        historico.client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        historico.client.cpf.includes(searchTerm) ||
        historico.client.telefone.includes(searchTerm)
      );
      setFilteredClientes(filtered);
    } else {
      setFilteredClientes(clientesListaNegra);
    }
  }, [searchTerm, clientesListaNegra]);

  const formatPhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/[^\d]/g, '');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 pt-16 md:pt-24">
      <div className="container mx-auto max-w-7xl">
        <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 flex items-center">
                  <AlertTriangle className="mr-3 text-yellow-300" size={36} />
                  Lista Negra
                </h1>
                <p className="text-sm md:text-base text-blue-100">
                  Visualize e gerencie clientes inadimplentes
                </p>
              </div>

              {/* Search Input */}
              <div className="relative mt-4 md:mt-0 w-full md:w-72">
                <input 
                  type="text" 
                  placeholder="Buscar cliente..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                {searchTerm && (
                  <X 
                    onClick={() => setSearchTerm('')} 
                    className="absolute right-3 top-3 text-gray-400 cursor-pointer hover:text-white" 
                    size={20} 
                  />
                )}
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="p-4 md:p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
              </div>
            ) : filteredClientes.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                Nenhum cliente encontrado na lista negra.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-white">
                  <thead className="bg-gray-700">
                    <tr>
                      {['Nome', 'CPF', 'Telefone', 'Valor', 'Juros', 'Total', 'Ações'].map((header) => (
                        <th key={header} className="px-4 py-3 text-sm font-semibold">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClientes.map((historico) => {
                      const formattedPhone = formatPhoneNumber(historico.client.telefone);
                      return (
                        <tr 
                          key={historico.id} 
                          className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-200"
                        >
                          <td className="px-4 py-4">{historico.client.nome}</td>
                          <td className="px-4 py-4">{historico.client.cpf}</td>
                          <td className="px-4 py-4">{historico.client.telefone}</td>
                          <td className="px-4 py-4">{formatCurrency(historico.client.valorPegado)}</td>
                          <td className="px-4 py-4">{historico.client.juros}%</td>
                          <td className="px-4 py-4 font-bold text-red-400">
                            {formatCurrency(historico.client.totalReceber)}
                          </td>
                          <td className="px-4 py-4 space-x-2">
                            <div className="flex space-x-2">
                              <a 
                                href={`tel:+55${formattedPhone}`} 
                                className="bg-blue-600 hover:bg-blue-500 p-2 rounded-full transition-colors"
                              >
                                <Phone size={18} className="text-white" />
                              </a>
                              <a 
                                href={`https://wa.me/+55${formattedPhone}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-green-600 hover:bg-green-500 p-2 rounded-full transition-colors"
                              >
                                <MessageCircle size={18} className="text-white" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListaNegra;