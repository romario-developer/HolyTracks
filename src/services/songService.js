import api from './api';

// Obter todas as músicas do usuário
export const getSongs = async (params = {}) => {
  try {
    const response = await api.get('/songs', { params });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Erro no servidor');
  }
};

// Obter uma música pelo ID
export const getSongById = async (id) => {
  try {
    const response = await api.get(`/songs/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Erro no servidor');
  }
};

// Criar uma nova música
export const createSong = async (songData) => {
  try {
    const response = await api.post('/songs', songData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Erro no servidor');
  }
};

// Atualizar uma música existente
export const updateSong = async (id, songData) => {
  try {
    const response = await api.put(`/songs/${id}`, songData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Erro no servidor');
  }
};

// Excluir uma música
export const deleteSong = async (id) => {
  try {
    const response = await api.delete(`/songs/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Erro no servidor');
  }
};

// Adicionar um marcador à música
export const addMarker = async (songId, markerData) => {
  try {
    const response = await api.post(`/songs/${songId}/markers`, markerData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Erro no servidor');
  }
};

// Remover um marcador da música
export const removeMarker = async (songId, markerId) => {
  try {
    const response = await api.delete(`/songs/${songId}/markers/${markerId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Erro no servidor');
  }
};