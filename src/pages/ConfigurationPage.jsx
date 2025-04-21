import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  CircularProgress,
  Alert,
  styled
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import SongForm from '../components/configuration/SongForm';
import TrackList from '../components/configuration/TrackList';
import { useSongContext } from '../context/SongContext';

// Estilização personalizada
const ConfigContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: 8,
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4)
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: theme.spacing(4)
}));

// Passos do processo
const steps = [
  'Upload',
  'Configuração',
  'Finalização'
];

const ConfigurationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    currentSong, 
    loadSong, 
    updateSongData, 
    isLoading,
    error
  } = useSongContext();
  
  const [songId, setSongId] = useState(null);
  
  // Extrair ID da música da query string
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('songId');
    
    if (id) {
      setSongId(id);
      loadSong(id).catch(err => console.error('Erro ao carregar música:', err));
    }
  }, [location.search, loadSong]);
  
  // Verificar se todos os campos obrigatórios estão preenchidos
  const isFormValid = () => {
    return (
      currentSong.title &&
      currentSong.key &&
      currentSong.bpm &&
      currentSong.timeSignature &&
      currentSong.tempo
    );
  };
  
  // Voltar para a página de upload
  const handleBack = () => {
    navigate('/upload');
  };
  
  // Avançar para a página de finalização
  const handleContinue = async () => {
    try {
      if (songId) {
        // Salvar as alterações antes de continuar
        await updateSongData(songId, currentSong);
      }
      
      // Redirecionar para a página de finalização com o ID da música
      navigate(`/finalize?songId=${songId}`);
    } catch (err) {
      console.error('Erro ao salvar configurações:', err);
    }
  };
  
  return (
    <Container maxWidth="md">
      <ConfigContainer elevation={2}>
        <Stepper activeStep={1} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Typography variant="h4" gutterBottom>
          Configurar sua música
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <SongForm />
            
            <TrackList songId={songId} />
            
            <ButtonContainer>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
              >
                Voltar
              </Button>
              
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={handleContinue}
                disabled={!isFormValid() || !songId}
              >
                Continuar
              </Button>
            </ButtonContainer>
          </>
        )}
      </ConfigContainer>
    </Container>
  );
};

export default ConfigurationPage;