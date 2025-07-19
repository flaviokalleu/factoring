import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from "recharts";
import { 
  CreditCard, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  UserX,
  Clock,
  Users,
  RefreshCcw,
  Percent
} from "lucide-react";

const FuturisticDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalInvested: 0,
    monthlyRevenue: 0,
    returnedInvestments: 0,
    interestReceived: 0,
    partialPayments: 0,
    lostInvestments: 0,
    overdueClients: [],
    clientStats: {
      totalClients: 0,
      activeClients: 0,
      newClients: 0,
      overdueClients: 0,
      averageLoanAmount: 0,
      totalInterestEarned: 0
    },
    monthlyTrends: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { getValidToken } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = await getValidToken();
        if (!token) {
          setError("Token inválido ou expirado. Faça login novamente.");
          return;
        }
  
        // Chamada para o dashboard
        const dashboardResponse = await axios.get("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        // Chamada para os clientes em atraso
        const overdueClientsResponse = await fetch('http://localhost:5000/api/clients/atrasado', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Passando o token no cabeçalho
          },
        });
  
        if (!overdueClientsResponse.ok) {
          throw new Error("Erro ao carregar os clientes em atraso.");
        }
  
        const overdueClientsData = await overdueClientsResponse.json();
  
        // Atualizando o estado com os dados do dashboard e dos clientes em atraso
        setDashboardData((prevData) => ({
          ...prevData,
          ...dashboardResponse.data,
          overdueClients: overdueClientsData,
        }));
  
        setLoading(false);
      } catch (err) {
        setError("Erro ao carregar os dados do dashboard.");
        console.error(err);
        setLoading(false);
      }
    };
  
    fetchDashboardData();
  }, [getValidToken]);
  

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 10);
  };
  const moedabr2 = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 1);
  };

  const calcularDiasAtraso = (dataEmprestimo) => {
    const hoje = new Date();
    const dataEmprestimoDate = new Date(dataEmprestimo);
    const diffTime = Math.abs(hoje - dataEmprestimoDate);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="animate-pulse text-white text-2xl">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-red-500">
        <h1 className="text-3xl">{error}</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8 pt-24">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Dashboard Financeiro
        </h1>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[ 
            { 
              icon: <DollarSign className="w-10 h-10 text-blue-400" />, 
              title: "Total Investido", 
              value: moedabr2(dashboardData.totalInvested),
              color: "text-blue-400"
            },
            { 
              icon: <TrendingUp className="w-10 h-10 text-green-400" />, 
              title: "Receita Mensal", 
              value: formatCurrency(dashboardData.monthlyRevenue),
              color: "text-green-400"
            },
            { 
              icon: <CreditCard className="w-10 h-10 text-yellow-400" />, 
              title: "Pagamentos Parciais", 
              value: formatCurrency(dashboardData.partialPayments),
              color: "text-yellow-400"
            },
            { 
              icon: <AlertTriangle className="w-10 h-10 text-red-400" />, 
              title: "Investimentos Perdidos", 
              value: formatCurrency(dashboardData.lostInvestments),
              color: "text-red-400"
            }
          ].map((metric, index) => (
            <div 
              key={index} 
              className="bg-gray-800 rounded-xl p-6 shadow-2xl border border-gray-700 hover:scale-105 transition-transform"
            >
              <div className="flex items-center justify-between mb-4">
                {metric.icon}
                <h3 className="text-lg font-semibold text-gray-300">{metric.title}</h3>
              </div>
              <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Line Chart Section */}
        <div className="bg-gray-900 rounded-xl p-8 shadow-xl border border-gray-700 mb-12">
  <h3 className="text-2xl font-bold mb-6 text-white">Tendências Mensais</h3>
  <ResponsiveContainer width="100%" height={400}>
  <LineChart data={dashboardData.monthlyTrends}>
    <CartesianGrid strokeDasharray="5 5" stroke="#4B5563" />
    <XAxis 
      dataKey="month" 
      stroke="#D1D5DB" 
      tick={{ fontSize: 12, fontWeight: 600 }}
      axisLine={{ stroke: '#374151' }}
    />
    <YAxis 
      stroke="#D1D5DB" 
      tick={{ fontSize: 12, fontWeight: 600 }}
      axisLine={{ stroke: '#374151' }}
    />
    <Tooltip 
      contentStyle={{ 
        backgroundColor: '#2D3748', 
        borderColor: '#374151',
        borderRadius: '8px', 
        padding: '10px' 
      }} 
      labelStyle={{ color: '#F9FAFB', fontWeight: 600 }}
      itemStyle={{ color: '#F9FAFB' }}
    />
    <Legend 
      wrapperStyle={{
        fontSize: '14px',
        fontWeight: '500',
        color: '#F9FAFB',
        marginTop: '10px'
      }} 
    />
    <Line 
      type="monotone" 
      dataKey="totalInvested" 
      stroke="#3B82F6" 
      strokeWidth={3} 
      dot={{ r: 4, stroke: '#3B82F6', strokeWidth: 2, fill: '#FFFFFF' }}
      activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 3, fill: '#FFFFFF' }}
      name="Total Investido"
    />
    <Line 
      type="monotone" 
      dataKey="interestEarned" 
      stroke="#10B981" 
      strokeWidth={3} 
      dot={{ r: 4, stroke: '#10B981', strokeWidth: 2, fill: '#FFFFFF' }}
      activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 3, fill: '#FFFFFF' }}
      name="Juros Recebidos"
    />
    <Line 
      type="monotone" 
      dataKey="partialPayments" 
      stroke="#F59E0B" 
      strokeWidth={3} 
      dot={{ r: 4, stroke: '#F59E0B', strokeWidth: 2, fill: '#FFFFFF' }}
      activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 3, fill: '#FFFFFF' }}
      name="Pagamentos Parciais"
    />
    <Line 
      type="monotone" 
      dataKey="returnedInvestments" 
      stroke="#E11D48" 
      strokeWidth={3} 
      dot={{ r: 4, stroke: '#E11D48', strokeWidth: 2, fill: '#FFFFFF' }}
      activeDot={{ r: 6, stroke: '#E11D48', strokeWidth: 3, fill: '#FFFFFF' }}
      name="Investimentos Retornados"
    />
  </LineChart>
</ResponsiveContainer>

</div>


        {/* Client Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 rounded-xl p-6 shadow-2xl border border-gray-700 md:col-span-3 grid grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg p-4 flex items-center">
              <Users className="mr-4 text-blue-400 w-10 h-10" />
              <div>
                <h4 className="text-gray-300 text-sm">Total de Clientes</h4>
                <p className="text-2xl font-bold text-blue-300">
                  {dashboardData.clientStats.totalClients}
                </p>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 flex items-center">
              <RefreshCcw className="mr-4 text-green-400 w-10 h-10" />
              <div>
                <h4 className="text-gray-300 text-sm">Clientes Ativos</h4>
                <p className="text-2xl font-bold text-green-300">
                  {dashboardData.clientStats.activeClients}
                </p>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 flex items-center">
              <Percent className="mr-4 text-yellow-400 w-10 h-10" />
              <div>
                <h4 className="text-gray-300 text-sm">Empréstimo Médio</h4>
                <p className="text-2xl font-bold text-yellow-300">
                  {formatCurrency(dashboardData.clientStats.averageLoanAmount)}
                </p>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 flex items-center">
              <Clock className="mr-4 text-purple-400 w-10 h-10" />
              <div>
                <h4 className="text-gray-300 text-sm">Total de Juros Recebidos</h4>
                <p className="text-2xl font-bold text-purple-300">
                  {moedabr2(dashboardData.clientStats.totalInterestEarned)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Clients in Delay Section */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-2xl border border-gray-700 mt-12">
          <h3 className="text-xl font-semibold mb-4 text-gray-200">Clientes em Atraso</h3>
          <div className="space-y-6">
            {dashboardData.overdueClients.map((client, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between bg-gray-700 rounded-lg p-4"
              >
                <div>
                  <h4 className="text-lg font-semibold text-gray-300">{client.nome}</h4>
                  <p className="text-sm text-gray-400">{client.telefone}</p>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-400">{calcularDiasAtraso(client.dataEmprestimo)} dias de atraso</span>
                  <UserX className="ml-4 text-red-400 w-6 h-6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuturisticDashboard;
