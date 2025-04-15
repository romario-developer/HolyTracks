import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
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
  const { currentSong } = useSongContext();
  
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
  const handleContinue = () => {
    // Aqui seria implementada a lógica para salvar os dados no backend
    // Por enquanto, apenas navegamos para a próxima página
    navigate('/finalize');
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
        
        <SongForm />
        
        <TrackList />
        
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
            disabled={!isFormValid()}
          >
            Continuar
          </Button>
        </ButtonContainer>
      </ConfigContainer>
    </Container>
  );
};

export default ConfigurationPage;