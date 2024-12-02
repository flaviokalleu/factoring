import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    const storedUser = Cookies.get('user');

    if (accessToken && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // Atualiza o estado após a verificação
  }, []);

  // Função para verificar se o token expirou
  const isTokenExpired = () => {
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) return true; // Se não houver token, considera como expirado

    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1])); // Decodifica o payload do JWT
      const expirationTime = payload.exp * 1000; // A expiração está em segundos, converta para milissegundos
      const currentTime = Date.now();

      return currentTime >= expirationTime; // Se o tempo atual for maior que a expiração, o token expirou
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return true; // Caso a decodificação falhe, consideramos o token como expirado
    }
  };

  // Função para renovar o token usando o refreshToken
  const renewAccessToken = async () => {
    const refreshToken = Cookies.get('refreshToken');
    if (!refreshToken) return null; // Se não houver refreshToken, não podemos renovar o accessToken

    try {
      const response = await axios.post('http://localhost:5000/api/auth/refresh-token', { refreshToken });
      const { accessToken } = response.data;

      // Atualiza os cookies com o novo accessToken
      Cookies.set('accessToken', accessToken, { expires: 1 }); // A expiração de 1 dia é apenas um exemplo
      return accessToken;
    } catch (error) {
      console.error('Erro ao renovar o accessToken:', error);
      return null;
    }
  };

  // Função de login
  const login = async (email, senha) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, senha });

      // Supondo que a resposta da API contenha id, username, accessToken, refreshToken
      const { userId, accessToken, refreshToken, username } = response.data;

      const userData = { userId, accessToken, refreshToken, username };

      // Salva os dados no Cookies
      Cookies.set('accessToken', accessToken, { expires: 1 });
      Cookies.set('refreshToken', refreshToken, { expires: 7 });
      Cookies.set('user', JSON.stringify(userData), { expires: 1 });

      setUser(userData);
      return true;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  };

  // Função de logout
  const logout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('user');
    setUser(null);
  };

  // Função para garantir que sempre tenhamos um token válido antes de realizar requisições
  const getValidToken = async () => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken && !isTokenExpired()) {
      return accessToken; // O token é válido, podemos usá-lo
    }

    const newAccessToken = await renewAccessToken();
    if (newAccessToken) {
      return newAccessToken; // Retorna o novo token se ele foi renovado com sucesso
    }

    // Se não conseguir renovar o token, desloga o usuário
    logout();
    return null; // Caso não consiga renovar o token, retorna null
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, getValidToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
