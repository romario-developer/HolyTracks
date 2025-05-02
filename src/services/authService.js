import api from './apiService';
import { API_ENDPOINTS } from '../config/apiConfig';

// Constantes para armazenamento
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_info';

// Serviço para gerenciar autenticação
const authService = {
  // Registrar novo usuário
  register: async (userData) => {
    // Comentado para testes sem autenticação
    /*
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('app_missa_token', response.data.token);
      localStorage.setItem('app_missa_user', JSON.stringify(response.data.user));
    }
    return response.data;
    */
    
    // Retorna um objeto simulado para testes
    return { success: true };
  },

  // Login de usuário
  login: async (credentials) => {
    // Comentado para testes sem autenticação
    /*
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('app_missa_token', response.data.token);
      localStorage.setItem('app_missa_user', JSON.stringify(response.data.user));
    }
    return response.data;
    */
    
    // Sempre retorna true para testes
    return { success: true };
  },

  // Logout de usuário
  logout: async () => {
    // Comentado para testes sem autenticação
    /*
    try {
      await api.get('/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      localStorage.removeItem('app_missa_token');
      localStorage.removeItem('app_missa_user');
    }
    */
    
    // Limpa o localStorage por precaução
    localStorage.removeItem('app_missa_token');
    localStorage.removeItem('app_missa_user');
  },

  // Obter usuário atual
  getCurrentUser: async () => {
    // Comentado para testes sem autenticação
    /*
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
    */
    
    // Retorna um usuário fictício para testes
    return { id: '1', name: 'Usuário Teste', email: 'teste@exemplo.com', role: 'admin' };
  },

  // Verificar se o usuário está autenticado
  isAuthenticated: () => {
    // Comentado para testes sem autenticação
    // return !!localStorage.getItem('app_missa_token');
    
    // Sempre retorna true para testes
    return true;
  }
};

// Funções de gerenciamento de token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY) || '';
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY) || '';
};

export const setRefreshToken = (token) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const setUserInfo = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUserInfo = () => {
  const userInfo = localStorage.getItem(USER_KEY);
  return userInfo ? JSON.parse(userInfo) : null;
};

export const removeAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};

// Funções de API
export const login = async (credentials) => {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Erro de login: ${response.status}`);
    }

    const data = await response.json();
    setToken(data.token);
    if (data.refreshToken) {
      setRefreshToken(data.refreshToken);
    }
    if (data.user) {
      setUserInfo(data.user);
    }
    return data;
  } catch (error) {
    console.error('Erro durante o login:', error);
    throw error;
  }
};

export const refreshAuthToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('Refresh token não disponível');
  }

  try {
    const response = await fetch(API_ENDPOINTS.AUTH.REFRESH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Falha ao atualizar o token');
    }

    const data = await response.json();
    setToken(data.token);
    return data.token;
  } catch (error) {
    console.error('Erro ao atualizar o token:', error);
    removeAuthData(); // Limpar dados de autenticação em caso de falha
    throw error;
  }
};

export const logout = () => {
  removeAuthData();
  // Você pode adicionar uma chamada à API para invalidar o token no servidor, se necessário
};

export default authService;