import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

// Hook personalizado para gerenciar uploads
const useUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // Função para fazer upload de um único arquivo
  const uploadFile = async (file, songId = null, metadata = {}) => {
    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      // Criar FormData para envio do arquivo
      const formData = new FormData();
      formData.append('file', file);
      
      // Adicionar metadados
      if (songId) formData.append('songId', songId);
      if (metadata.name) formData.append('name', metadata.name);
      if (metadata.type) formData.append('type', metadata.type);

      // Configurar o progresso do upload
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      };

      // Fazer a requisição
      const response = await api.post('/upload', formData, config);
      setUploadProgress(100);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao fazer upload do arquivo');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  // Função para fazer upload de múltiplos arquivos
  const uploadMultipleFiles = async (files, songId = null) => {
    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      // Criar FormData para envio dos arquivos
      const formData = new FormData();
      
      // Adicionar cada arquivo ao FormData
      files.forEach((file) => {
        formData.append('files', file);
      });
      
      // Adicionar songId se fornecido
      if (songId) formData.append('songId', songId);

      // Configurar o progresso do upload
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      };

      // Fazer a requisição
      const response = await api.post('/upload/multiple', formData, config);
      setUploadProgress(100);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao fazer upload dos arquivos');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  // Função para excluir um arquivo
  const deleteFile = async (trackId) => {
    try {
      const response = await api.delete(`/upload/${trackId}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao excluir o arquivo');
      throw err;
    }
  };

  return {
    uploadFile,
    uploadMultipleFiles,
    deleteFile,
    uploadProgress,
    isUploading,
    error
  };
};

export default useUpload;