import React, { useEffect, useState } from 'react';
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
  ButtonGroup,
  styled,
  CircularProgress
} from '@mui/material';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import SuccessMessage from '../components/finalization/SuccessMessage';
import SongDetails from '../components/finalization/SongDetails';
import { useSongContext } from '../context/SongContext';

// Estilização personalizada
const FinalContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: 8,
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4)
}));

const ButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(2),
  marginTop: theme.spacing(4),
  flexWrap: 'wrap'
}));

// Passos do processo
const steps = [
  'Upload',
  'Configuração',
  'Finalização'
];

const FinalizationPage = () => {
  const navigate = useNavigate();
  const { currentSong, saveSong } = useSongContext();
  const [saving, setSaving] = useState(true);
  const [saveResult, setSaveResult] = useState(null);
  
  // Simular salvamento ao carregar a página
  useEffect(() => {
    const save = async () => {
      try {
        const result = await saveSong();
        setSaveResult(result);
        setSaving(false);
      } catch (error) {
        console.error('Erro ao salvar:', error);
        setSaveResult({ success: false, message: 'Erro ao salvar a música.' });
        setSaving(false);
      }
    };
    
    save();
  }, [saveSong]);
  
  // Abrir no App (simulação)
  const handleOpenInApp = () => {
    alert('Redirecionando para o App Missa...');
    // Em uma implementação real, isso abriria um deep link para o app
  };
  
  // Ver na biblioteca
  const handleViewInLibrary = () => {
    navigate('/library');
  };
  
  // Adicionar outra música
  const handleAddAnother = () => {
    navigate('/upload');
  };
  
  // Se ainda estiver salvando, mostrar indicador de progresso
  if (saving) {
    return (
      <Container maxWidth="md">
        <FinalContainer elevation={2}>
          <Stepper activeStep={2} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h6">
              Salvando sua música...
            </Typography>
          </Box>
        </FinalContainer>
      </Container>
    );
  }
  
  // Se ocorreu erro no salvamento
  if (saveResult && !saveResult.success) {
    return (
      <Container maxWidth="md">
        <FinalContainer elevation={2}>
          <Stepper activeStep={2} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" color="error" gutterBottom>
              Erro ao salvar a música
            </Typography>
            <Typography variant="body1" paragraph>
              {saveResult.message || 'Ocorreu um erro ao processar sua música. Por favor, tente novamente.'}
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/configuration')}
              sx={{ mt: 2 }}
            >
              Voltar e tentar novamente
            </Button>
          </Box>
        </FinalContainer>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md">
      <FinalContainer elevation={2}>
        <Stepper activeStep={2} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label} completed>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <SuccessMessage />
        
        <SongDetails />
        
        <ButtonsContainer>
          <Button
            variant="contained"
            startIcon={<PhoneAndroidIcon />}
            color="success"
            onClick={handleOpenInApp}
            size="large"
          >
            Abrir no App
          </Button>
          
          <Button
            variant="contained"
            startIcon={<LibraryMusicIcon />}
            onClick={handleViewInLibrary}
            size="large"
          >
            Ver na Biblioteca
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<AddCircleIcon />}
            onClick={handleAddAnother}
            size="large"
          >
            Adicionar outra música
          </Button>
        </ButtonsContainer>
      </FinalContainer>
    </Container>
  );
};

export default FinalizationPage;