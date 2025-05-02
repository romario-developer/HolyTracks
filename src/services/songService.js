import apiClient from './apiService';

// Defina a URL da API
const API_URL = 'http://localhost:8000/api';

// Dados mockados para desenvolvimento
const MOCK_SONGS = [
  { id: 1, title: 'Música de Exemplo 1', artist: 'Artista 1', duration: 180 },
  { id: 2, title: 'Música de Exemplo 2', artist: 'Artista 2', duration: 240 },
  { id: 3, title: 'Música de Exemplo 3', artist: 'Artista 3', duration: 200 },
];

// Função para buscar todas as músicas
export const getSongs = async () => {
  try {
    
    const response = await apiClient.get('/songs');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar músicas:', error);
    
    // Se estiver em ambiente de desenvolvimento, retorne dados mockados
    if (process.env.NODE_ENV === 'development') {
      console.log('Usando dados mockados para desenvolvimento');
      return MOCK_SONGS;
    }
    
    throw error;
  }
};

// Função para buscar uma música específica pelo ID
export const getSongById = async (songId) => {
  try {
    const response = await apiClient.get(`${API_URL}/songs/${songId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar música com ID ${songId}:`, error);
    throw error;
  }
};

// Função para fazer upload de uma música
export const uploadSong = async (formData) => {
  try {
    const response = await apiClient.post(`${API_URL}/songs/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao fazer upload da música:', error);
    throw error;
  }
};

// Função para atualizar uma música
export const updateSong = async (songId, songData) => {
  try {
    const response = await apiClient.put(`${API_URL}/songs/${songId}`, songData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar música com ID ${songId}:`, error);
    throw error;
  }
};

// Função para excluir uma música
export const deleteSong = async (songId) => {
  try {
    const response = await apiClient.delete(`${API_URL}/songs/${songId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao excluir música com ID ${songId}:`, error);
    throw error;
  }
};

// Função para buscar músicas por categoria
export const getSongsByCategory = async (category) => {
  try {
    const response = await apiClient.get(`${API_URL}/songs/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar músicas da categoria ${category}:`, error);
    throw error;
  }
};

// Função para buscar músicas por artista
export const getSongsByArtist = async (artist) => {
  try {
    const response = await apiClient.get(`${API_URL}/songs/artist/${artist}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar músicas do artista ${artist}:`, error);
    throw error;
  }
};

// Função para buscar músicas favoritas do usuário
export const getFavoriteSongs = async () => {
  try {
    const response = await apiClient.get(`${API_URL}/songs/favorites`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar músicas favoritas:', error);
    throw error;
  }
};

// Função para criar uma nova música
export const createSong = async (songData) => {
  try {
    const response = await apiClient.post(`${API_URL}/songs`, songData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar música:', error);
    throw error;
  }
};

// Função para adicionar um marcador a uma música
export const addMarker = async (songId, markerData) => {
  try {
    const response = await apiClient.post(`${API_URL}/songs/${songId}/markers`, markerData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao adicionar marcador à música com ID ${songId}:`, error);
    throw error;
  }
};

// Função para remover um marcador de uma música
export const removeMarker = async (songId, markerId) => {
  try {
    const response = await apiClient.delete(`${API_URL}/songs/${songId}/markers/${markerId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao remover marcador ${markerId} da música com ID ${songId}:`, error);
    throw error;
  }
};