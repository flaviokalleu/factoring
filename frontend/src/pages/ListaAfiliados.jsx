import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  PhoneCall, 
  MapPin, 
  FileText, 
  PlusCircle, 
  BookOpen, 
  ChevronRight 
} from 'lucide-react';

function ListaAfiliados() {
  const { user, getValidToken } = useAuth();
  const [afiliados, setAfiliados] = useState([]);
  const [novoAfiliado, setNovoAfiliado] = useState({
    nome: '',
    telefone: '',
    endereco: '',
    observacoes: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoricoModalOpen, setIsHistoricoModalOpen] = useState(false);
  const [historicoAfiliado, setHistoricoAfiliado] = useState([]);
  const [afiliadoSelecionado, setAfiliadoSelecionado] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoAfiliado(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const adicionarAfiliado = async () => {
    if (Object.values(novoAfiliado).some(field => !field)) {
      alert('Todos os campos são obrigatórios!');
      return;
    }

    try {
      const token = await getValidToken();
      if (!token) {
        alert('Token expirado ou inválido, faça login novamente.');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/afiliados',
        { 
          ...novoAfiliado, 
          userId: user.userId
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setAfiliados(prev => [...prev, response.data]);
      setIsModalOpen(false);
      setNovoAfiliado({
        nome: '',
        telefone: '',
        endereco: '',
        observacoes: ''
      });
    } catch (error) {
      console.error('Erro ao adicionar afiliado:', error);
      alert('Erro ao adicionar afiliado');
    }
  };

  const carregarAfiliados = async () => {
    try {
      const token = await getValidToken();
      if (!token || !user?.userId) {
        alert('Usuário não encontrado ou token inválido');
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/afiliados/${user.userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setAfiliados(response.data);
    } catch (error) {
      console.error('Erro ao carregar afiliados:', error);
      alert('Erro ao carregar afiliados');
    }
  };

  const carregarHistorico = async (afiliadoId) => {
    try {
      const token = await getValidToken();
      if (!token) {
        alert('Token expirado ou inválido, faça login novamente.');
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/afiliadoHistorico/${afiliadoId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setHistoricoAfiliado(response.data);
      setAfiliadoSelecionado(afiliadoId);
      setIsHistoricoModalOpen(true);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      alert('Erro ao carregar histórico do afiliado');
    }
  };

  useEffect(() => {
    if (user) {
      carregarAfiliados();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 md:p-10 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 pt-24">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Gerenciamento de Afiliados
            </h1>
            <p className="text-gray-300 mt-2">Gerencie e acompanhe seus afiliados com facilidade</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all transform hover:scale-105"
          >
            <PlusCircle className="mr-2" />
            Novo Afiliado
          </button>
        </div>

        {/* Tabela de Afiliados */}
        <div className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  {['Nome', 'Telefone', 'Endereço', 'Observações', 'Ações'].map((header) => (
                    <th 
                      key={header} 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {afiliados.map((afiliado) => (
                  <tr 
                    key={afiliado.id} 
                    className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="mr-3 text-blue-400" />
                        <span>{afiliado.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <PhoneCall className="mr-3 text-green-400" />
                        {afiliado.telefone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <MapPin className="mr-3 text-red-400" />
                        {afiliado.endereco}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FileText className="mr-3 text-yellow-400" />
                        {afiliado.observacoes}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => carregarHistorico(afiliado.id)}
                        className="flex items-center bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-3 py-1.5 rounded-md shadow-md transition-all transform hover:scale-105"
                      >
                        <BookOpen className="mr-2 w-4 h-4" />
                        Histórico
                        <ChevronRight className="ml-1 w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Novo Afiliado */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
              <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Cadastrar Novo Afiliado
              </h2>
              <div className="space-y-4">
                {[
                  { name: 'nome', placeholder: 'Nome do Afiliado', Icon: User },
                  { name: 'telefone', placeholder: 'Telefone', Icon: PhoneCall },
                  { name: 'endereco', placeholder: 'Endereço', Icon: MapPin },
                ].map(({ name, placeholder, Icon }) => (
                  <div key={name} className="relative">
                    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name={name}
                      value={novoAfiliado[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
                <textarea
                  name="observacoes"
                  value={novoAfiliado.observacoes}
                  onChange={handleChange}
                  placeholder="Observações"
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={adicionarAfiliado}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700"
                  >
                    Adicionar Afiliado
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Histórico */}
        {isHistoricoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
              <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500">
                Histórico do Afiliado
              </h2>
              {historicoAfiliado.length === 0 ? (
                <p className="text-gray-400 text-center">Sem histórico disponível</p>
              ) : (
                <ul className="space-y-3">
                  {historicoAfiliado.map((item, index) => (
                    <li 
                      key={index} 
                      className="bg-slate-700 rounded-lg p-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold text-blue-300">Comissão: {item.comissao}</p>
                        <p className="text-gray-400">Total a Receber: {item.totalReceber}</p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(item.data).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setIsHistoricoModalOpen(false)}
                  className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListaAfiliados;