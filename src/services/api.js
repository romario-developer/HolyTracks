import axios from 'axios';

// Criar instância do axios com configurações base
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    // Obter token do localStorage
    const token = localStorage.getItem('app_missa_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tratar erros de autenticação (401)
    if (error.response && error.response.status === 401) {
      // Limpar dados de autenticação
      localStorage.removeItem('app_missa_token');
      localStorage.removeItem('app_missa_user');
      
      // Redirecionar para login (se necessário)
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;