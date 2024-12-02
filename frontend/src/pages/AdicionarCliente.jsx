import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Save, Info } from 'lucide-react'; // Importe o componente Info
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ElegantClientRegistration() {
  const { user, loading } = useAuth();
  const [cliente, setCliente] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    endereco: '',
    observacoes: '',
    valorPegado: '',
    juros: 10, // Inicialização com 10% de juros
    totalReceber: '',
    jurosReceber: '',
    dataEmprestimo: '',
    userId: '',
    afiliadoId: '',
    porcentagemAfiliado: '',
    dataUltimaAtualizacao: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [afiliados, setAfiliados] = useState([]);

  useEffect(() => {
    if (user) {
      setCliente(prev => ({ ...prev, userId: user.id }));
    }
  }, [user]);

  useEffect(() => {
    const fetchAfiliados = async () => {
      const token = Cookies.get('accessToken');
      if (!token) {
        toast.error('Usuário não autenticado');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/afiliados', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAfiliados(data);
        } else {
          toast.error('Erro ao buscar afiliados');
        }
      } catch (error) {
        toast.error('Erro de rede ao buscar afiliados');
      }
    };

    fetchAfiliados();
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!cliente.nome) errors.nome = 'Nome é obrigatório';
    if (!cliente.cpf) errors.cpf = 'CPF/CNPJ é obrigatório';
    if (!cliente.telefone) errors.telefone = 'Telefone é obrigatório';
    if (!cliente.valorPegado) errors.valorPegado = 'Valor Pegado é obrigatório';
    if (!cliente.dataEmprestimo) errors.dataEmprestimo = 'Data do Empréstimo é obrigatória';
    if (!cliente.afiliadoId) errors.afiliadoId = 'Afiliado é obrigatório';
    if (!cliente.porcentagemAfiliado) errors.porcentagemAfiliado = 'Porcentagem do Afiliado é obrigatória';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calcularDivida = () => {
    const valor = parseFloat(cliente.valorPegado);
    const juros = parseFloat(cliente.juros);

    if (!isNaN(valor) && !isNaN(juros)) {
      const valorComJuros = valor + (valor * (juros / 100));
      const jurosReceber = valor * (juros / 100);
      
      setCliente(prev => ({
        ...prev,
        jurosReceber: (jurosReceber / 10).toFixed(2), // Ajuste para dividir por 10
        totalReceber: (valorComJuros / 10).toFixed(2), // Ajuste para dividir por 10
      }));
    }
  };

  useEffect(() => {
    if (cliente.valorPegado && cliente.juros !== '') {
      calcularDivida();
    }
  }, [cliente.valorPegado, cliente.juros]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isValid = validateForm();
    if (!isValid) return;

    const dataAtualizacao = new Date().toISOString();
    setCliente(prev => ({
      ...prev,
      dataUltimaAtualizacao: dataAtualizacao,
    }));

    const token = Cookies.get('accessToken');
    if (!token) {
      toast.error('Usuário não autenticado');
      return;
    }

    const comissaoAfiliado = (parseFloat(cliente.totalReceber) * (parseFloat(cliente.porcentagemAfiliado) / 100)).toFixed(2);

    try {
      const response = await fetch('http://localhost:5000/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(cliente),
      });

      if (!response.ok) {
        toast.error('Erro ao cadastrar o cliente');
        return;
      }

      const responseComissao = await fetch('http://localhost:5000/api/afiliadoHistorico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          afiliadoId: cliente.afiliadoId,
          comissao: comissaoAfiliado,
          totalReceber: cliente.totalReceber,
        }),
      });

      if (!responseComissao.ok) {
        toast.error('Erro ao cadastrar a comissão do afiliado');
        return;
      }

      toast.success('Cliente e comissão cadastrados com sucesso!', {
        position: 'top-right',
        autoClose: 3000,
      });

      setCliente({
        nome: '',
        cpf: '',
        telefone: '',
        endereco: '',
        observacoes: '',
        valorPegado: '',
        juros: 10,
        totalReceber: '',
        jurosReceber: '',
        dataEmprestimo: '',
        userId: user?.id || '',
        afiliadoId: '',
        porcentagemAfiliado: '',
        dataUltimaAtualizacao: '',
      });
      setFormErrors({});
    } catch (error) {
      toast.error('Erro de rede ao cadastrar o cliente');
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 sm:p-10 pt-24">
          <h2 className="text-3xl font-extrabold text-center text-white mb-8 flex items-center justify-center">
            <Info className="mr-3 text-indigo-400" />
            Cadastro de Cliente
          </h2>
  
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
              <input
                type="text"
                name="nome"
                value={cliente.nome}
                onChange={handleChange}
                className="w-full pl-3 pr-4 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                placeholder="Nome do cliente"
              />
              {formErrors.nome && <p className="text-red-500 text-xs mt-1">{formErrors.nome}</p>}
            </div>
  
            {/* CPF */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">CPF/CNPJ</label>
              <input
                type="text"
                name="cpf"
                value={cliente.cpf}
                onChange={handleChange}
                className="w-full pl-3 pr-4 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                placeholder="CPF ou CNPJ"
              />
              {formErrors.cpf && <p className="text-red-500 text-xs mt-1">{formErrors.cpf}</p>}
            </div>
  
            {/* Telefone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Telefone</label>
              <input
                type="text"
                name="telefone"
                value={cliente.telefone}
                onChange={handleChange}
                className="w-full pl-3 pr-4 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                placeholder="Telefone do cliente"
              />
              {formErrors.telefone && <p className="text-red-500 text-xs mt-1">{formErrors.telefone}</p>}
            </div>
  
            {/* Endereço */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Endereço</label>
              <input
                type="text"
                name="endereco"
                value={cliente.endereco}
                onChange={handleChange}
                className="w-full pl-3 pr-4 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                placeholder="Endereço do cliente"
              />
            </div>
  
            {/* Observações */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Observações</label>
              <textarea
                name="observacoes"
                value={cliente.observacoes}
                onChange={handleChange}
                className="w-full pl-3 pr-4 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                placeholder="Observações"
                rows="3"
              />
            </div>
  
            {/* Valor Pegado */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Valor Pegado</label>
              <input
                type="number"
                name="valorPegado"
                value={cliente.valorPegado}
                onChange={handleChange}
                className="w-full pl-3 pr-4 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                placeholder="Valor Pegado"
              />
              {formErrors.valorPegado && <p className="text-red-500 text-xs mt-1">{formErrors.valorPegado}</p>}
            </div>
  
            {/* Juros */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Juros (%)</label>
              <input
                type="number"
                name="juros"
                value={cliente.juros}
                onChange={handleChange}
                className="w-full pl-3 pr-4 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                placeholder="Juros"
              />
            </div>
  
            {/* Total a Receber */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Total a Receber</label>
              <input
                type="text"
                name="totalReceber"
                value={cliente.totalReceber}
                readOnly
                className="w-full pl-3 pr-4 py-3 bg-gray-700 border rounded-lg text-gray-300"
                placeholder="Total a Receber"
              />
            </div>
  
            {/* Juros a Receber */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Juros a Receber</label>
              <input
                type="text"
                name="jurosReceber"
                value={cliente.jurosReceber}
                readOnly
                className="w-full pl-3 pr-4 py-3 bg-gray-700 border rounded-lg text-gray-300"
                placeholder="Juros a Receber"
              />
            </div>
  
            {/* Data do Empréstimo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Data do Empréstimo</label>
              <input
                type="date"
                name="dataEmprestimo"
                value={cliente.dataEmprestimo}
                onChange={handleChange}
                className="w-full pl-3 pr-4 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              />
              {formErrors.dataEmprestimo && <p className="text-red-500 text-xs mt-1">{formErrors.dataEmprestimo}</p>}
            </div>
  
            {/* Afiliado */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Afiliado</label>
              <select
                name="afiliadoId"
                value={cliente.afiliadoId}
                onChange={handleChange}
                className="w-full pl-3 pr-4 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              >
                <option value="">Selecione um afiliado</option>
                {afiliados.map((afiliado) => (
                  <option key={afiliado.id} value={afiliado.id}>{afiliado.nome}</option>
                ))}
              </select>
              {formErrors.afiliadoId && <p className="text-red-500 text-xs mt-1">{formErrors.afiliadoId}</p>}
            </div>
  
            {/* Porcentagem do Afiliado */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Porcentagem do Afiliado (%)</label>
              <input
                type="number"
                name="porcentagemAfiliado"
                value={cliente.porcentagemAfiliado}
                onChange={handleChange}
                className="w-full pl-3 pr-4 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                placeholder="Porcentagem do Afiliado"
              />
              {formErrors.porcentagemAfiliado && <p className="text-red-500 text-xs mt-1">{formErrors.porcentagemAfiliado}</p>}
            </div>
  
            {/* Botão de Submissão */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-5 py-3 bg-indigo-500 text-white font-medium text-sm leading-5 rounded-lg hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Save className="mr-2" />
                Salvar Cliente
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ElegantClientRegistration;
