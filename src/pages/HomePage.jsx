import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  styled 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import TimerIcon from '@mui/icons-material/Timer';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';

// Estilização personalizada
const HeroSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0, 6),
  textAlign: 'center'
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8]
  }
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(2)
}));

const HomePage = () => {
  const navigate = useNavigate();
  
  const goToUpload = () => {
    navigate('/upload');
  };
  
  const goToLibrary = () => {
    navigate('/library');
  };
  
  // Recursos do aplicativo
  const features = [
    {
      title: 'Organize por Instrumentos',
      description: 'Carregue e gerencie faixas separadas por instrumento para melhor controle durante a missa.',
      icon: <MusicNoteIcon fontSize="large" color="primary" />
    },
    {
      title: 'Marcações Personalizadas',
      description: 'Adicione marcações para introdução, estrofes, refrão e outras partes da música.',
      icon: <TimerIcon fontSize="large" color="primary" />
    },
    {
      title: 'Tempos Litúrgicos',
      description: 'Organize suas músicas conforme o calendário litúrgico: Tempo Comum, Quaresma, Páscoa, etc.',
      icon: <QueueMusicIcon fontSize="large" color="primary" />
    }
  ];
  
  return (
    <>
      <HeroSection>
        <Container maxWidth="md">
          <Typography variant="h3" gutterBottom>
            App Missa
          </Typography>
          <Typography variant="h5" color="textSecondary" paragraph>
            Gerenciamento de músicas para liturgia católica
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="contained" 
              size="large" 
              startIcon={<CloudUploadIcon />}
              onClick={goToUpload}
            >
              Carregar Música
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              startIcon={<LibraryMusicIcon />}
              onClick={goToLibrary}
            >
              Minhas Músicas
            </Button>
          </Box>
        </Container>
      </HeroSection>
      
      <Container sx={{ py: 8 }} maxWidth="md">
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <FeatureCard>
                <CardContent>
                  <FeatureIcon>
                    {feature.icon}
                  </FeatureIcon>
                  <Typography gutterBottom variant="h5" component="h2" align="center">
                    {feature.title}
                  </Typography>
                  <Typography align="center">
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default HomePage;