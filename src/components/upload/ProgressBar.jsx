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
  const { uploadProgress } = useSongContext();
  
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
        <Typography variant="body2">
          {uploadProgress < 100 ? 'Enviando arquivos...' : 'Upload completo!'}
        </Typography>
        <Typography variant="body2">{uploadProgress}%</Typography>
      </ProgressInfo>
    </ProgressContainer>
  );
};

export default ProgressBar;