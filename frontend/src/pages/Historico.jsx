import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  CalendarCheck, 
  Filter, 
  Search, 
  X, 
  Download, 
  AlertCircle 
} from 'lucide-react';

function Historico() {
  const { user, getValidToken } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [histories, setHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchHistories() {
      setIsLoading(true);
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const token = await getValidToken();
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5000/api/historico/user/${user.userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch histories');
        }

        const data = await response.json();
        setHistories(data);
      } catch (error) {
        console.error('Error fetching histories:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistories();
  }, [user, getValidToken]);

  const filteredHistories = histories.flatMap((clientData) => {
    return clientData.history.filter((history) => {
      const historyDate = new Date(history.data);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      const searchTermLower = searchTerm.toLowerCase();

      return (
        (!start || historyDate >= start) &&
        (!end || historyDate <= end) &&
        (!searchTerm || 
          clientData.client.nome.toLowerCase().includes(searchTermLower) ||
          history.acao.toLowerCase().includes(searchTermLower))
      );
    }).map((history) => ({
      ...history,
      client: clientData.client,
    }));
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 10);
  };

  const handleExportCSV = () => {
    // Create CSV content
    const csvContent = [
      "ID,Cliente,Ação,Valor,Data",
      ...filteredHistories.map((history, index) => 
        `${index + 1},${history.client.nome},${history.acao},${formatCurrency(history.valor)},${new Date(history.data).toLocaleDateString()}`
      )
    ].join("\n");

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "historico_emprestimos.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 pt-16 md:pt-24">
      <div className="container mx-auto max-w-7xl">
        <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 flex items-center">
                  <CalendarCheck className="mr-3 text-yellow-300" size={36} />
                  Histórico de Empréstimos
                </h1>
                <p className="text-sm md:text-base text-purple-100">
                  Visualize e exporte seu histórico de transações
                </p>
              </div>

              {/* Search and Export Section */}
              <div className="flex space-x-4 mt-4 md:mt-0">
                {/* Search Input */}
                <div className="relative w-full md:w-72">
                  <input 
                    type="text" 
                    placeholder="Buscar empréstimo..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
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

                {/* Export Button */}
                <button 
                  onClick={handleExportCSV}
                  className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-full transition-colors"
                >
                  <Download size={24} />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-gray-700 p-4">
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center text-white hover:text-purple-300 transition-colors"
              >
                <Filter className="mr-2" size={20} />
                {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Data Início</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 rounded-lg bg-gray-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Data Fim</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 rounded-lg bg-gray-800 text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Table Section */}
          <div className="p-4 md:p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500"></div>
              </div>
            ) : filteredHistories.length === 0 ? (
              <div className="text-center text-gray-400 py-12 flex flex-col items-center">
                <AlertCircle size={48} className="text-yellow-500 mb-4" />
                <p>Nenhum histórico de empréstimo encontrado.</p>
                <p className="text-sm mt-2">Tente ajustar seus filtros ou verificar as datas.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-white">
                  <thead className="bg-gray-700">
                    <tr>
                      {['ID', 'Cliente', 'Ação', 'Valor', 'Data'].map((header) => (
                        <th key={header} className="px-4 py-3 text-sm font-semibold">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistories.map((history, index) => (
                      <tr 
                        key={index} 
                        className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-200"
                      >
                        <td className="px-4 py-4">{index + 1}</td>
                        <td className="px-4 py-4">{history.client.nome}</td>
                        <td className="px-4 py-4">{history.acao}</td>
                        <td className="px-4 py-4 font-semibold text-green-400">
                          {formatCurrency(history.valor)}
                        </td>
                        <td className="px-4 py-4">
                          {new Date(history.data).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
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

export default Historico;