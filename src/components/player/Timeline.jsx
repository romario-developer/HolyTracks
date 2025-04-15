import React, { useState, useRef } from 'react';
import { Box, Paper, Tooltip, styled } from '@mui/material';

// Estilização personalizada
const TimelineContainer = styled(Paper)(({ theme }) => ({
  height: 40,
  backgroundColor: '#333',
  position: 'relative',
  borderRadius: 4,
  margin: theme.spacing(1, 0),
  overflow: 'hidden',
  cursor: 'pointer'
}));

const TimeMarker = styled(Box)(({ theme }) => ({
  position: 'absolute',
  height: '100%',
  width: 2,
  backgroundColor: 'red',
  top: 0,
  pointerEvents: 'none',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: 'red',
    borderRadius: '50%',
    top: -5,
    left: -4
  }
}));

const Mark = styled(Box)(({ theme, color }) => ({
  position: 'absolute',
  height: '100%',
  width: 3,
  backgroundColor: color || '#ffeb3b',
  opacity: 0.7,
  cursor: 'pointer',
  zIndex: 2,
  '&:hover': {
    opacity: 1,
    width: 5
  }
}));

const Timeline = ({ 
  currentTime, 
  duration, 
  onSeek,
  markers = [],
  onMarkerClick
}) => {
  const timelineRef = useRef(null);
  const [hoveredPosition, setHoveredPosition] = useState(null);
  
  // Calcular a posição do marcador em porcentagem
  const calculateMarkerPosition = (time) => {
    return (time / duration) * 100 + '%';
  };
  
  // Manipular clique na timeline
  const handleTimelineClick = (e) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = offsetX / rect.width;
    const seekTime = percentage * duration;
    
    onSeek(seekTime);
  };
  
  // Manipular hover na timeline
  const handleTimelineHover = (e) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = offsetX / rect.width;
    
    setHoveredPosition(percentage);
  };
  
  // Formatar o tempo em MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <Tooltip
      title={hoveredPosition !== null ? formatTime(hoveredPosition * duration) : ''}
      followCursor
      open={hoveredPosition !== null}
    >
      <TimelineContainer
        ref={timelineRef}
        onClick={handleTimelineClick}
        onMouseMove={handleTimelineHover}
        onMouseLeave={() => setHoveredPosition(null)}
      >
        {/* Marcadores de seções */}
        {markers.map((marker, index) => (
          <Tooltip key={index} title={marker.label} placement="top">
            <Mark
              style={{ left: calculateMarkerPosition(marker.time) }}
              color={marker.color}
              onClick={(e) => {
                e.stopPropagation();
                onMarkerClick(marker);
              }}
            />
          </Tooltip>
        ))}
        
        {/* Marcador de posição atual */}
        <TimeMarker style={{ left: calculateMarkerPosition(currentTime) }} />
      </TimelineContainer>
    </Tooltip>
  );
};

export default Timeline;