import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

// Importações de páginas
import Dashboard from './pages/Dashboard';
import Historico from './pages/Historico';
import AdicionarCliente from './pages/AdicionarCliente';
import ListaClientes from './pages/ListaClientes';
import Cobrança from './pages/Cobranca';
import ListaNegra from './pages/ListaNegra';
import ListaAfiliados from './pages/ListaAfiliados';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';

// Importando o Navbar
import Navbar from './components/Navbar';

// Layout Privado (onde o Navbar será renderizado)
function PrivateLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Navbar />
      <div className="flex-1 pl-0 overflow-auto">{children}</div>
    </div>
  );
}

// Componente de Rota Protegida
function PrivateRoute({ children }) {
  const { user, loading } = useAuth(); // Usando 'user' para verificar a autenticação

  if (loading) {
    return <div>Carregando...</div>; // Ou um spinner de carregamento
  }

  // Se não estiver autenticado, redireciona para a página de login
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Router>
      <Routes>
      
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Rotas privadas */}
        <Route path="/" element={
          
            <LandingPage />
          
        } />

        {/* Rotas privadas */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <PrivateLayout><Dashboard /></PrivateLayout>
          </PrivateRoute>
        } />
        <Route path="/historico" element={
          <PrivateRoute>
            <PrivateLayout><Historico /></PrivateLayout>
          </PrivateRoute>
        } />
        <Route path="/adicionar-cliente" element={
          <PrivateRoute>
            <PrivateLayout><AdicionarCliente /></PrivateLayout>
          </PrivateRoute>
        } />
        <Route path="/lista-clientes" element={
          <PrivateRoute>
            <PrivateLayout><ListaClientes /></PrivateLayout>
          </PrivateRoute>
        } />
        <Route path="/cobranca" element={
          <PrivateRoute>
            <PrivateLayout><Cobrança /></PrivateLayout>
          </PrivateRoute>
        } />
        
        <Route path="/lista-negra" element={
          <PrivateRoute>
            <PrivateLayout><ListaNegra /></PrivateLayout>
          </PrivateRoute>
        } />
        <Route path="/lista-afiliados" element={
          <PrivateRoute>
            <PrivateLayout><ListaAfiliados /></PrivateLayout>
          </PrivateRoute>
        } />

        {/* Redireciona para login se rota não encontrada */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
