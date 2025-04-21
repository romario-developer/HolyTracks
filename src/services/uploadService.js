import api from './api';

// Upload de um único arquivo
export const uploadTrack = async (file, songId, name, type) => {
  try {
    // Criar FormData para envio de arquivo
    const formData = new FormData();
    formData.append('file', file);
    
    if (songId) {
      formData.append('songId', songId);
    }
    
    if (name) {
      formData.append('name', name);
    }
    
    if (type) {
      formData.append('type', type);
    }
    
    // Configurar headers especiais para upload de arquivo
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    
    const response = await api.post('/upload', formData, config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Erro no servidor');
  }
};

// Upload de múltiplos arquivos
export const uploadMultipleTracks = async (files, songId) => {
  try {
    // Criar FormData para envio de múltiplos arquivos
    const formData = new FormData();
    
    // Adicionar cada arquivo ao FormData
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });
    
    if (songId) {
      formData.append('songId', songId);
    }
    
    // Configurar headers especiais para upload de arquivo
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    
    const response = await api.post('/upload/multiple', formData, config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Erro no servidor');
  }
};

// Excluir um arquivo
export const deleteTrack = async (trackId) => {
  try {
    const response = await api.delete(`/upload/${trackId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Erro no servidor');
  }
};

// Obter URL para download
export const getDownloadUrl = async (trackId) => {
  try {
    const response = await api.get(`/upload/${trackId}/download`);
    return response.data.url;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Erro no servidor');
  }
};