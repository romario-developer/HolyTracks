import React from 'react';
import { 
  Box, 
  Typography, 
  Slider, 
  IconButton,
  Paper,
  styled 
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import HeadphonesIcon from '@mui/icons-material/Headphones';

// Estilização personalizada
const TrackPaper = styled(Paper)(({ theme, isMuted }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1.5),
  backgroundColor: '#333',
  color: 'white',
  borderRadius: 6,
  opacity: isMuted ? 0.5 : 1,
  transition: 'opacity 0.3s'
}));

const TrackColorBar = styled(Box)(({ theme, color }) => ({
  width: 5,
  height: 40,
  borderRadius: 3,
  marginRight: theme.spacing(2),
  backgroundColor: color || theme.palette.primary.main
}));

const TrackInfo = styled(Box)(({ theme }) => ({
  flex: 1
}));

const TrackControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1)
}));

const ControlButton = styled(IconButton)(({ theme, isActive, color }) => ({
  width: 36,
  height: 36,
  backgroundColor: isActive ? color || theme.palette.primary.main : '#444',
  '&:hover': {
    backgroundColor: isActive ? color || theme.palette.primary.main : '#555'
  }
}));

// Cores para diferentes tipos de instrumentos
const trackColors = {
  drums: '#f44336',
  bass: '#2196F3',
  guitar: '#4CAF50',
  acoustic: '#FF9800',
  keys: '#9C27B0',
  pads: '#00BCD4',
  fx: '#FF5722',
  vocals: '#FFEB3B'
};

const TrackItem = ({ 
  track, 
  onVolumeChange, 
  onMuteToggle, 
  onSoloToggle 
}) => {
  return (
    <TrackPaper elevation={3} isMuted={track.muted}>
      <TrackColorBar color={trackColors[track.type]} />
      
      <TrackInfo>
        <Typography variant="subtitle1" fontWeight="bold">
          {track.name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          {track.muted ? (
            <VolumeOffIcon fontSize="small" sx={{ mr: 1, color: '#999' }} />
          ) : (
            <VolumeUpIcon fontSize="small" sx={{ mr: 1 }} />
          )}
          
          <Slider
            value={track.volume}
            onChange={(e, newValue) => onVolumeChange(track.id, newValue)}
            min={0}
            max={100}
            size="small"
            aria-label={`Volume de ${track.name}`}
            sx={{ 
              color: trackColors[track.type] || 'primary',
              width: '100%'
            }}
          />
        </Box>
      </TrackInfo>
      
      <TrackControls>
        <ControlButton
          size="small"
          isActive={track.muted}
          color="#f44336"
          onClick={() => onMuteToggle(track.id)}
        >
          <Typography variant="button" sx={{ color: 'white', fontSize: 12 }}>
            M
          </Typography>
        </ControlButton>
        
        <ControlButton
          size="small"
          isActive={track.solo}
          color="#4CAF50"
          onClick={() => onSoloToggle(track.id)}
        >
          <Typography variant="button" sx={{ color: 'white', fontSize: 12 }}>
            S
          </Typography>
        </ControlButton>
      </TrackControls>
    </TrackPaper>
  );
};

export default TrackItem;