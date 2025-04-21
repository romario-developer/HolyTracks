import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Paper, Alert, styled } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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

const FileList = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  textAlign: 'left',
  maxHeight: '200px',
  overflowY: 'auto'
}));

const FileItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
  borderRadius: theme.spacing(0.5),
  backgroundColor: theme.palette.grey[100],
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}));

const UploadArea = ({ onFilesSelected }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadError, setUploadError] = useState(null);

  // Função chamada quando os arquivos são soltos ou selecionados
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length === 0) {
      setUploadError('Nenhum arquivo selecionado');
      return;
    }

    // Verificar tipos de arquivo
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'application/zip'];
    const allValid = acceptedFiles.every(file => 
      validTypes.includes(file.type) || file.name.endsWith('.zip') || file.name.endsWith('.mp3') || file.name.endsWith('.wav')
    );

    if (!allValid) {
      setUploadError('Apenas arquivos de áudio (MP3, WAV) ou ZIP são permitidos');
      return;
    }

    setUploadError(null);
    setSelectedFiles(acceptedFiles);
    
    // Notificar componente pai sobre os arquivos selecionados
    if (onFilesSelected) {
      onFilesSelected(acceptedFiles);
    }
  }, [onFilesSelected]);

  // Formatação do tamanho do arquivo
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // Configuração do react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a'],
      'application/zip': ['.zip']
    },
    maxSize: 100 * 1024 * 1024, // 100MB max
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
      </UploadPaper>
      
      {uploadError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {uploadError}
        </Alert>
      )}
      
      {selectedFiles.length > 0 && (
        <FileList>
          <Typography variant="subtitle2" gutterBottom>
            Arquivos selecionados:
          </Typography>
          
          {selectedFiles.map((file, index) => (
            <FileItem key={index}>
              <Typography variant="body2">{file.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {formatFileSize(file.size)}
              </Typography>
            </FileItem>
          ))}
        </FileList>
      )}
    </Box>
  );
};

export default UploadArea;