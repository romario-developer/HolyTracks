import api from './api';

// Serviço para gerenciar autenticação
const authService = {
  // Registrar novo usuário
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('app_missa_token', response.data.token);
      
      // Correção: Verificar se os dados do usuário existem e salvá-los corretamente
      if (response.data.user) {
        localStorage.setItem('app_missa_user', JSON.stringify(response.data.user));
      } else if (response.data.data) {
        // Alternativa: se o usuário estiver em response.data.data
        localStorage.setItem('app_missa_user', JSON.stringify(response.data.data));
      }
    }
    return response.data;
  },

  // Login de usuário
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('app_missa_token', response.data.token);
      
      // Correção: Verificar se os dados do usuário existem e salvá-los corretamente
      if (response.data.user) {
        localStorage.setItem('app_missa_user', JSON.stringify(response.data.user));
      } else if (response.data.data) {
        // Alternativa: se o usuário estiver em response.data.data
        localStorage.setItem('app_missa_user', JSON.stringify(response.data.data));
      }
    }
    return response.data;
  },

  // Logout de usuário
  logout: async () => {
    try {
      await api.get('/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      localStorage.removeItem('app_missa_token');
      localStorage.removeItem('app_missa_user');
    }
  },

  // Obter usuário atual
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      
      // Atualizar os dados do usuário no localStorage
      if (response.data && (response.data.user || response.data.data)) {
        const userData = response.data.user || response.data.data;
        localStorage.setItem('app_missa_user', JSON.stringify(userData));
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
  },

  // Verificar se o usuário está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('app_missa_token');
  }
};

export default authService;