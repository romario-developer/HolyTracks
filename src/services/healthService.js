import { API_BASE_URL } from '../config/apiConfig';

export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`Servidor retornou status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao verificar a saúde da API:', error);
    throw error;
  }
};