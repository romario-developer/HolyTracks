import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

// Criar o contexto de autenticação
const AuthContext = createContext();

// Hook personalizado para usar o contexto
export const useAuth = () => useContext(AuthContext);

// Provedor do contexto de autenticação
export const AuthProvider = ({ children }) => {
  // Estado para armazenar os dados do usuário autenticado
  const [currentUser, setCurrentUser] = useState(null);
  // Estado para controlar o carregamento inicial (verificar token)
  const [loading, setLoading] = useState(true);

  // Verificar se há token salvo ao carregar
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('app_missa_token');
      
      if (token) {
        try {
          // Buscar perfil do usuário usando o token
          const response = await authService.getCurrentUser();
          // A resposta do backend tem o usuário em response.data.data
          setCurrentUser(response.data.data);
        } catch (error) {
          // Se o token for inválido, remover do localStorage
          console.error('Erro ao verificar autenticação:', error);
          localStorage.removeItem('app_missa_token');
        }
      }
      
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Função para registrar novo usuário
  const register = async (name, email, password) => {
    try {
      const response = await authService.register({ name, email, password });
      
      // Token já é salvo pelo serviço
      // A resposta do backend tem o usuário em response.data.data
      setCurrentUser(response.data.data);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Função para fazer login
  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      
      // Token já é salvo pelo serviço
      // A resposta do backend tem o usuário em response.data.data
      setCurrentUser(response.data.data);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Função para fazer logout
  const logout = async () => {
    // O serviço já remove o token do localStorage
    await authService.logout();
    setCurrentUser(null);
  };

  // Valor do contexto
  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;