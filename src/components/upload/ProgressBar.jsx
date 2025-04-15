import React from 'react';
import { Box, LinearProgress, Typography, styled } from '@mui/material';
import { useSongContext } from '../../context/SongContext';

const ProgressContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3)
}));

const ProgressInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 14,
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(1)
}));

const ProgressBar = () => {
  const { uploadProgress, audioFiles } = useSongContext();
  
  // Calcular tamanho total dos arquivos
  const calculateTotalSize = () => {
    if (!audioFiles.length) return '0 MB';
    
    const totalBytes = audioFiles.reduce((acc, file) => acc + file.size, 0);
    return formatFileSize(totalBytes);
  };
  
  // Calcular tamanho enviado
  const calculateUploadedSize = () => {
    if (!audioFiles.length) return '0 MB';
    
    const totalBytes = audioFiles.reduce((acc, file) => acc + file.size, 0);
    const uploadedBytes = totalBytes * (uploadProgress / 100);
    return formatFileSize(uploadedBytes);
  };
  
  // Formatar tamanho de arquivo
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };
  
  return (
    <ProgressContainer>
      <LinearProgress 
        variant="determinate" 
        value={uploadProgress} 
        sx={{ 
          height: 10, 
          borderRadius: 5,
          backgroundColor: '#e0e0e0'
        }} 
      />
      
      <ProgressInfo>
        <Typography variant="body2">{calculateUploadedSize()}</Typography>
        <Typography variant="body2">/ {calculateTotalSize()}</Typography>
      </ProgressInfo>
    </ProgressContainer>
  );
};

export default ProgressBar;