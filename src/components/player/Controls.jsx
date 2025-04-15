import React from 'react';
import { 
  Box, 
  IconButton, 
  Typography, 
  styled 
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';

// Estilização personalizada
const ControlsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  backgroundColor: '#2c2c2c',
  borderRadius: 4
}));

const TransportContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}));

const PlayButton = styled(IconButton)(({ theme }) => ({
  width: 50,
  height: 50,
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark
  }
}));

const TimeDisplay = styled(Typography)(({ theme }) => ({
  fontFamily: 'monospace',
  fontSize: 16
}));

const Controls = ({ 
  isPlaying, 
  currentTime, 
  duration, 
  onPlay, 
  onPause, 
  onRewind, 
  onForward, 
  onPrevMarker, 
  onNextMarker 
}) => {
  // Formatar o tempo em MM:SS
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '00:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <ControlsContainer>
      <TransportContainer>
        <IconButton 
          onClick={onPrevMarker} 
          color="inherit"
          size="small"
        >
          <SkipPreviousIcon />
        </IconButton>
        
        <IconButton 
          onClick={onRewind} 
          color="inherit"
          size="small"
        >
          <FastRewindIcon />
        </IconButton>
        
        <PlayButton onClick={isPlaying ? onPause : onPlay}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </PlayButton>
        
        <IconButton 
          onClick={onForward} 
          color="inherit"
          size="small"
        >
          <FastForwardIcon />
        </IconButton>
        
        <IconButton 
          onClick={onNextMarker} 
          color="inherit"
          size="small"
        >
          <SkipNextIcon />
        </IconButton>
      </TransportContainer>
      
      <TimeDisplay>
        {formatTime(currentTime)} / {formatTime(duration)}
      </TimeDisplay>
    </ControlsContainer>
  );
};

export default Controls;