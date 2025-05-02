import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getSongs, 
  getSongById, 
  createSong, 
  updateSong, 
  deleteSong,
  addMarker,
  removeMarker
} from '../services/songService';
import { 
  uploadTrack, 
  uploadMultipleTracks, 
  deleteTrack, 
  getDownloadUrl 
} from '../services/uploadService';
import { toast } from 'react-toastify'; // Adicione esta biblioteca para notificações

// Criando o contexto
const SongContext = createContext();

// Hook personalizado para usar o contexto
export const useSongContext = () => useContext(SongContext);

// Provedor do contexto
export const SongProvider = ({ children }) => {
  // Estado para armazenar os dados da música atual
  const [currentSong, setCurrentSong] = useState({
    title: '',
    key: '',
    bpm: '',
    timeSignature: '',
    tempo: '',
    notes: '',
    tracks: []
  });

  // Estado para armazenar todas as músicas do usuário
  const [userSongs, setUserSongs] = useState([]);

  // Estado para controlar o fluxo de upload
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carregar músicas do usuário quando o componente montar
  useEffect(() => {
    loadUserSongs();
  }, []);

  // Função para carregar todas as músicas do usuário
  const loadUserSongs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getSongs();
      setUserSongs(response.data || []);
    } catch (err) {
      const errorMsg = err.message || 'Erro ao carregar músicas';
      setError(errorMsg);
      console.error('Erro ao carregar músicas:', err);
      toast.error(errorMsg); // Notificação para o usuário
    } finally {
      setIsLoading(false);
    }
  };

  // Função para carregar uma música específica
  const loadSong = async (songId) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getSongById(songId);
      setCurrentSong(response.data || {});
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Erro ao carregar música';
      setError(errorMsg);
      console.error('Erro ao carregar música:', err);
      toast.error(errorMsg); // Notificação para o usuário
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Função para atualizar dados da música
  const updateSongData = async (songId, data) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await updateSong(songId, data);
      setCurrentSong(response.data);
      
      // Atualizar a lista de músicas do usuário
      await loadUserSongs();
      
      toast.success('Música atualizada com sucesso!'); // Feedback positivo
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Erro ao atualizar música';
      setError(errorMsg);
      console.error('Erro ao atualizar música:', err);
      toast.error(errorMsg); // Notificação para o usuário
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Função para criar uma nova música
  const saveSong = async (songData = currentSong) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validação básica dos dados
      if (!songData.title) {
        const errorMsg = 'O título da música é obrigatório';
        setError(errorMsg);
        toast.error(errorMsg);
        return { success: false, message: errorMsg };
      }
      
      const response = await createSong(songData);
      
      // Atualizar a lista de músicas do usuário
      await loadUserSongs();
      
      toast.success('Música salva com sucesso!'); // Feedback positivo
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Erro ao salvar música';
      setError(errorMsg);
      console.error('Erro ao salvar música:', err);
      toast.error(errorMsg); // Notificação para o usuário
      return { success: false, message: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Função para excluir uma música
  const removeSong = async (songId) => {
    try {
      setIsLoading(true);
      setError(null);
      await deleteSong(songId);
      
      // Atualizar a lista de músicas do usuário
      await loadUserSongs();
      
      // Se a música atual for a excluída, limpar o estado
      if (currentSong._id === songId) {
        setCurrentSong({
          title: '',
          key: '',
          bpm: '',
          timeSignature: '',
          tempo: '',
          notes: '',
          tracks: []
        });
      }
      
      return true;
    } catch (err) {
      setError(err.message || 'Erro ao excluir música');
      console.error('Erro ao excluir música:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Função para adicionar um marcador
  const addSongMarker = async (songId, markerData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await addMarker(songId, markerData);
      
      // Atualizar música atual se for a mesma
      if (currentSong._id === songId) {
        setCurrentSong(response.data);
      }
      
      return response.data;
    } catch (err) {
      setError(err.message || 'Erro ao adicionar marcador');
      console.error('Erro ao adicionar marcador:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Função para remover um marcador
  const removeSongMarker = async (songId, markerId) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await removeMarker(songId, markerId);
      
      // Atualizar música atual se for a mesma
      if (currentSong._id === songId) {
        setCurrentSong(response.data);
      }
      
      return response.data;
    } catch (err) {
      setError(err.message || 'Erro ao remover marcador');
      console.error('Erro ao remover marcador:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Função para fazer upload de uma track
  const uploadSongTrack = async (file, songId, name, type) => {
    try {
      setUploadProgress(0);
      setUploadComplete(false);
      setError(null);
      
      // Configurar para monitorar o progresso do upload
      const onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      };
      
      // Adicionar opção de progresso ao objeto config
      const config = { onUploadProgress };
      
      const response = await uploadTrack(file, songId, name, type, config);
      setUploadComplete(true);
      
      // Se a música atual for a que recebeu a nova track, atualizar
      if (currentSong._id === songId) {
        await loadSong(songId);
      }
      
      return response.data;
    } catch (err) {
      setError(err.message || 'Erro ao fazer upload');
      console.error('Erro ao fazer upload:', err);
      throw err;
    }
  };

  // Função para fazer upload de múltiplas tracks
  const uploadMultipleSongTracks = async (files, songId) => { 
    try { 
      setUploadProgress(0); 
      setUploadComplete(false); 
      setError(null); 
      
      // Verificar se files existe e é um array 
      if (!files || !Array.isArray(files) || files.length === 0) { 
        setError('Nenhum arquivo selecionado para upload'); 
        return { success: false, message: 'Nenhum arquivo selecionado' }; 
      } 
      
      // Configurar para monitorar o progresso do upload 
      const onUploadProgress = (progressEvent) => { 
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total); 
        setUploadProgress(percentCompleted); 
      }; 
      
      // Adicionar opção de progresso ao objeto config 
      const config = { onUploadProgress }; 
      
      // Verificar se songId existe antes de prosseguir
      if (!songId) {
        setError('ID da música não fornecido');
        return { success: false, message: 'ID da música não fornecido' };
      }
      
      const response = await uploadMultipleTracks(files, songId, config); 
      setUploadComplete(true); 
      
      // Verificar se currentSong e currentSong._id existem antes de comparar
      if (currentSong && currentSong._id === songId) { 
        await loadSong(songId); 
      } 
      
      return response; 
    } catch (err) { 
      setError(err.message || 'Erro ao fazer upload múltiplo'); 
      console.error('Erro ao fazer upload múltiplo:', err); 
      throw err; 
    } 
  };

  // Função para excluir uma track
  const removeTrack = async (trackId, songId) => {
    try {
      setIsLoading(true);
      setError(null);
      await deleteTrack(trackId);
      
      // Se a música atual for a que teve uma track removida, atualizar
      if (songId && currentSong._id === songId) {
        await loadSong(songId);
      }
      
      return true;
    } catch (err) {
      setError(err.message || 'Erro ao excluir track');
      console.error('Erro ao excluir track:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Função para obter URL de download de uma track
  const getTrackDownloadUrl = async (trackId) => {
    try {
      setIsLoading(true);
      setError(null);
      const url = await getDownloadUrl(trackId);
      return url;
    } catch (err) {
      setError(err.message || 'Erro ao obter URL de download');
      console.error('Erro ao obter URL de download:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Valores e funções disponibilizados pelo contexto
  const value = {
    currentSong,
    userSongs,
    uploadProgress,
    uploadComplete,
    isLoading,
    error,
    loadUserSongs,
    loadSong,
    updateSongData,
    saveSong,
    removeSong,
    addSongMarker,
    removeSongMarker,
    uploadSongTrack,
    uploadMultipleSongTracks,
    removeTrack,
    getTrackDownloadUrl,
    setCurrentSong,
    setUploadComplete
  };

  return (
    <SongContext.Provider value={value}>
      {children}
    </SongContext.Provider>
  );
};

export default SongContext;