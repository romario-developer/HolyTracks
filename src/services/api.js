import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';
 
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('holytracks_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o erro for 401 (Não autorizado), limpar o localStorage
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('holytracks_token');
      localStorage.removeItem('holytracks_user');
      // Redirecionar para a página de login, se necessário
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
