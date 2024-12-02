// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>; // Exibe o carregamento enquanto verifica o login
  }

  // Se não estiver autenticado, redireciona para o login
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
