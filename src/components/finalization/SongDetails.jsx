import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Grid,
  styled
} from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { useSongContext } from '../../context/SongContext';

// Estilização personalizada
const DetailsPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#f9f9f9',
  padding: theme.spacing(3),
  borderRadius: 8,
  margin: theme.spacing(3, 0)
}));

const SongTitle = styled(Typography)(({ theme }) => ({
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: theme.spacing(2)
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(1)
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginRight: theme.spacing(1)
}));

const TrackItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1, 0),
  borderBottom: '1px solid #eee',
  '&:last-child': {
    borderBottom: 'none'
  }
}));

// Função para obter o label das opções pelo valor
const getKeyLabel = (value) => {
  const keys = {
    'C': 'C (Dó maior)',
    'C#': 'C# (Dó sustenido maior)',
    'D': 'D (Ré maior)',
    'D#': 'D# (Ré sustenido maior)',
    'E': 'E (Mi maior)',
    'F': 'F (Fá maior)',
    'F#': 'F# (Fá sustenido maior)',
    'G': 'G (Sol maior)',
    'G#': 'G# (Sol sustenido maior)',
    'A': 'A (Lá maior)',
    'A#': 'A# (Lá sustenido maior)',
    'B': 'B (Si maior)'
  };
  
  return keys[value] || value;
};

const getTempoLabel = (value) => {
  const tempos = {
    'comum': 'Tempo Comum',
    'quaresma': 'Quaresma',
    'pascoa': 'Páscoa',
    'advento': 'Advento',
    'natal': 'Natal'
  };
  
  return tempos[value] || value;
};

const getInstrumentLabel = (value) => {
  const instruments = {
    'drums': 'Bateria',
    'bass': 'Baixo',
    'guitar': 'Guitarra',
    'acoustic': 'Violão',
    'keys': 'Teclado',
    'pads': 'Pads',
    'fx': 'Efeitos',
    'vocals': 'Vocais'
  };
  
  return instruments[value] || value;
};

const getInstrumentIcon = (type) => {
  // Em uma implementação real, poderíamos ter ícones diferentes para cada instrumento
  return '🎵';
};

const SongDetails = () => {
  const { currentSong } = useSongContext();
  
  return (
    <DetailsPaper elevation={0}>
      <SongTitle variant="h5">
        {currentSong.title}
      </SongTitle>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 3 }}>
            <InfoItem>
              <InfoLabel variant="body1">Tonalidade:</InfoLabel>
              <Typography variant="body1">{getKeyLabel(currentSong.key)}</Typography>
            </InfoItem>
            
            <InfoItem>
              <InfoLabel variant="body1">BPM:</InfoLabel>
              <Typography variant="body1">{currentSong.bpm}</Typography>
            </InfoItem>
            
            <InfoItem>
              <InfoLabel variant="body1">Compasso:</InfoLabel>
              <Typography variant="body1">{currentSong.timeSignature}</Typography>
            </InfoItem>
            
            <InfoItem>
              <InfoLabel variant="body1">Tempo Litúrgico:</InfoLabel>
              <Typography variant="body1">{getTempoLabel(currentSong.tempo)}</Typography>
            </InfoItem>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={12}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Tracks:
          </Typography>
          
          <List disablePadding>
            {currentSong.tracks.map((track, index) => (
              <TrackItem key={index} disableGutters>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {getInstrumentIcon(track.type)}
                </ListItemIcon>
                <ListItemText 
                  primary={track.name} 
                  secondary={getInstrumentLabel(track.type)}
                />
              </TrackItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </DetailsPaper>
  );
};

export default SongDetails;