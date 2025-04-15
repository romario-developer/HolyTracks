import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Paper, styled } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useSongContext } from '../../context/SongContext';

// Estilização personalizada
const UploadPaper = styled(Paper)(({ theme, isDragActive }) => ({
  border: isDragActive ? `2px dashed ${theme.palette.primary.main}` : '2px dashed #ccc',
  borderRadius: 8,
  padding: theme.spacing(8, 2),
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: isDragActive ? 'rgba(33, 150, 243, 0.05)' : 'transparent',
  transition: 'all 0.3s',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: 'rgba(33, 150, 243, 0.05)'
  }
}));

const IconContainer = styled(Box)({
  fontSize: 50,
  color: '#ccc',
  marginBottom: 15
});

const UploadArea = () => {
  const { simulateUpload } = useSongContext();
  const [uploadError, setUploadError] = useState(null);

  // Função chamada quando os arquivos são soltos ou selecionados
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length === 0) {
      setUploadError('Nenhum arquivo selecionado');
      return;
    }

    // Verificar tipos de arquivo
    const validTypes = ['audio/mpeg', 'audio/wav', 'application/zip'];
    const allValid = acceptedFiles.every(file => 
      validTypes.includes(file.type) || file.name.endsWith('.zip')
    );

    if (!allValid) {
      setUploadError('Apenas arquivos de áudio (MP3, WAV) ou ZIP são permitidos');
      return;
    }

    setUploadError(null);
    simulateUpload(acceptedFiles);
  }, [simulateUpload]);

  // Configuração do react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav'],
      'application/zip': ['.zip']
    }
  });

  return (
    <Box>
      <UploadPaper {...getRootProps()} isDragActive={isDragActive} elevation={0}>
        <input {...getInputProps()} />
        <IconContainer>
          <CloudUploadIcon fontSize="inherit" color="inherit" />
        </IconContainer>
        
        <Typography variant="h6" gutterBottom>
          <strong>Arraste o arquivo na tela</strong>
        </Typography>
        
        <Typography variant="body1" gutterBottom>
          ou clique aqui para procurar seu arquivo
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          Todos os arquivos dentro de um ZIP deve ser arquivos de áudio (MP3, WAV ou mp4).
        </Typography>
        
        {uploadError && (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {uploadError}
          </Typography>
        )}
      </UploadPaper>
    </Box>
  );
};

export default UploadArea;