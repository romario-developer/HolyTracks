// Configuração da API com variáveis de ambiente
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Endpoints específicos
export const API_ENDPOINTS = {
  SONGS: `${API_BASE_URL}/songs`,
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    REFRESH: `${API_BASE_URL}/auth/refresh-token`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    ME: `${API_BASE_URL}/auth/me`,
  },
  UPLOAD: `${API_BASE_URL}/upload`,
  HEALTH: `${API_BASE_URL}/health`,
};

export default API_ENDPOINTS;

