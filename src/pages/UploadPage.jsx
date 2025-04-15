import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  ToggleButton, 
  ToggleButtonGroup,
  styled 
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import UploadArea from '../components/upload/UploadArea';
import ProgressBar from '../components/upload/ProgressBar';
import { useSongContext } from '../context/SongContext';

// Estilização personalizada
const UploadContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: 8,
  padding: theme.spacing(4),
  marginTop: theme.spacing(4)
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  padding: theme.spacing(2.5),
  margin: theme.spacing(0, 2),
  borderRadius: 8,
  width: 180,
  textTransform: 'none',
  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  '&.Mui-selected': {
    borderColor: theme.palette.primary.main,
    backgroundColor: 'rgba(33, 150, 243, 0.05)'
  }
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  fontSize: 40,
  marginBottom: theme.spacing(1)
}));

const UploadPage = () => {
  const navigate = useNavigate();
  const { uploadComplete, uploadProgress } = useSongContext();
  const [uploadType, setUploadType] = useState('personal');

  // Mudar tipo de upload
  const handleUploadTypeChange = (event, newType) => {
    if (newType !== null) {
      setUploadType(newType);
    }
  };

  // Navegar para a próxima página
  const handleContinue = () => {
    navigate('/configure');
  };

  return (
    <Container maxWidth="md">
      <UploadContainer elevation={2}>
        <Typography variant="h4" align="center" gutterBottom>
          Carregar nova música
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <ToggleButtonGroup
            value={uploadType}
            exclusive
            onChange={handleUploadTypeChange}
            aria-label="tipo de upload"
          >
            <StyledToggleButton value="personal" aria-label="uso pessoal">
              <Box sx={{ textAlign: 'center' }}>
                <IconWrapper>
                  <PersonIcon fontSize="inherit" />
                </IconWrapper>
                <Typography>Uso pessoal</Typography>
              </Box>
            </StyledToggleButton>
            
            <StyledToggleButton value="share" aria-label="compartilhar">
              <Box sx={{ textAlign: 'center' }}>
                <IconWrapper>
                  <LocalOfferIcon fontSize="inherit" />
                </IconWrapper>
                <Typography>Compartilhar</Typography>
              </Box>
            </StyledToggleButton>
          </ToggleButtonGroup>
        </Box>
        
        <UploadArea />
        
        {uploadProgress > 0 && (
          <Box sx={{ mt: 3 }}>
            <ProgressBar />
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="contained" 
            size="large"
            disabled={!uploadComplete}
            onClick={handleContinue}
          >
            Continuar
          </Button>
        </Box>
      </UploadContainer>
    </Container>
  );
};

export default UploadPage;