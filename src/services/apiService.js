import axios from 'axios';

// Definindo endpoints da API
const API_ENDPOINTS = {
  BASE_URL: 'http://localhost:8000/api'
};

// Função para criar um cliente de API com interceptação
export const createApiClient = () => {
  const client = axios.create({
    baseURL: API_ENDPOINTS.BASE_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Interceptor para adicionar o token de autenticação em todas as requisições
  client.interceptors.request.use(
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
  client.interceptors.response.use(
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

  return client;
};

// Criar e exportar uma instância do cliente API
export const api = createApiClient();

// Manter a exportação padrão
export default createApiClient();