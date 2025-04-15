import React, { createContext, useContext, useState } from 'react';

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

  // Estado para armazenar os arquivos de áudio
  const [audioFiles, setAudioFiles] = useState([]);

  // Estado para controlar o fluxo de upload
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

  // Função para atualizar dados da música
  const updateSongData = (data) => {
    setCurrentSong(prev => ({ ...prev, ...data }));
  };

  // Função para adicionar tracks
  const addTracks = (tracks) => {
    setCurrentSong(prev => ({
      ...prev,
      tracks: [...prev.tracks, ...tracks]
    }));
  };

  // Função para atualizar uma track específica
  const updateTrack = (index, trackData) => {
    const updatedTracks = [...currentSong.tracks];
    updatedTracks[index] = { ...updatedTracks[index], ...trackData };
    
    setCurrentSong(prev => ({
      ...prev,
      tracks: updatedTracks
    }));
  };

  // Função para simular o upload
  const simulateUpload = (files) => {
    setAudioFiles(files);
    setUploadProgress(0);
    
    // Simulação do progresso de upload
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadComplete(true);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  // Função para salvar o projeto
  const saveSong = async () => {
    // Aqui seria implementada a lógica para salvar no backend
    console.log('Salvando música:', currentSong);
    
    // Simulação de salvamento bem-sucedido
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          songId: 'song_' + Date.now(),
          message: 'Música salva com sucesso!'
        });
      }, 1500);
    });
  };

  // Valores e funções disponibilizados pelo contexto
  const value = {
    currentSong,
    audioFiles,
    uploadProgress,
    uploadComplete,
    updateSongData,
    addTracks,
    updateTrack,
    simulateUpload,
    saveSong,
    setUploadComplete
  };

  return (
    <SongContext.Provider value={value}>
      {children}
    </SongContext.Provider>
  );
};

export default SongContext;