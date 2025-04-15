import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Tabs, 
  Tab,
  styled 
} from '@mui/material';

import TrackItem from '../components/player/TrackItem';
import Timeline from '../components/player/Timeline';
import Controls from '../components/player/Controls';

// Estilização personalizada
const PlayerContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: '#222',
  color: '#fff',
  borderRadius: 8,
  overflow: 'hidden',
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
}));

const SongInfoContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: '#282828'
}));

const TabsContainer = styled(Box)(({ theme }) => ({
  borderBottom: '1px solid #333',
  backgroundColor: '#1e1e1e'
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 48,
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  color: '#aaa',
  minHeight: 48,
  '&.Mui-selected': {
    color: theme.palette.primary.main
  }
}));

const TracksContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  overflowY: 'auto',
  flex: 1
}));

const PlayerPage = () => {
  // Estados locais
  const [currentTab, setCurrentTab] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(200); // Valor padrão para exemplo
  const [tracks, setTracks] = useState([
    { id: 1, name: 'BATERIA', type: 'drums', volume: 80, muted: false, solo: false },
    { id: 2, name: 'BAIXO', type: 'bass', volume: 70, muted: false, solo: false },
    { id: 3, name: 'GUITARRA', type: 'guitar', volume: 75, muted: true, solo: false },
    { id: 4, name: 'TECLADO', type: 'keys', volume: 65, muted: false, solo: false }
  ]);
  const [markers, setMarkers] = useState([
    { time: 20, label: 'Introdução', color: '#f44336' },
    { time: 60, label: 'Verso', color: '#4CAF50' },
    { time: 120, label: 'Refrão', color: '#2196F3' },
    { time: 160, label: 'Ponte', color: '#FF9800' }
  ]);
  
  // Referência para o intervalo de atualização do tempo
  const timerRef = useRef(null);
  
  // Atualizar o tempo durante a reprodução
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime(prevTime => {
          const newTime = prevTime + 0.1;
          if (newTime >= duration) {
            setIsPlaying(false);
            clearInterval(timerRef.current);
            return 0;
          }
          return newTime;
        });
      }, 100);
    } else {
      clearInterval(timerRef.current);
    }
    
    return () => clearInterval(timerRef.current);
  }, [isPlaying, duration]);
  
  // Limpar o intervalo quando o componente for desmontado
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);
  
  // Mudar a tab ativa
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  // Controles de reprodução
  const handlePlay = () => {
    setIsPlaying(true);
  };
  
  const handlePause = () => {
    setIsPlaying(false);
  };
  
  const handleSeek = (time) => {
    setCurrentTime(time);
  };
  
  const handleRewind = () => {
    setCurrentTime(prevTime => Math.max(0, prevTime - 5));
  };
  
  const handleForward = () => {
    setCurrentTime(prevTime => Math.min(duration, prevTime + 5));
  };
  
  // Encontrar o marcador mais próximo
  const findNearestMarker = (direction) => {
    if (markers.length === 0) return;
    
    if (direction === 'next') {
      const nextMarker = markers.find(marker => marker.time > currentTime);
      return nextMarker || markers[0]; // Voltar para o início se não houver próximo
    } else {
      // Ordenar os marcadores em ordem decrescente de tempo
      const sortedMarkers = [...markers].sort((a, b) => b.time - a.time);
      const prevMarker = sortedMarkers.find(marker => marker.time < currentTime);
      return prevMarker || sortedMarkers[0]; // Ir para o último se não houver anterior
    }
  };
  
  const handlePrevMarker = () => {
    const marker = findNearestMarker('prev');
    if (marker) {
      setCurrentTime(marker.time);
    }
  };
  
  const handleNextMarker = () => {
    const marker = findNearestMarker('next');
    if (marker) {
      setCurrentTime(marker.time);
    }
  };
  
  const handleMarkerClick = (marker) => {
    setCurrentTime(marker.time);
  };
  
  // Controles de track
  const handleVolumeChange = (trackId, newVolume) => {
    setTracks(prevTracks => 
      prevTracks.map(track => 
        track.id === trackId ? { ...track, volume: newVolume } : track
      )
    );
  };
  
  const handleMuteToggle = (trackId) => {
    setTracks(prevTracks => 
      prevTracks.map(track => 
        track.id === trackId ? { ...track, muted: !track.muted } : track
      )
    );
  };
  
  const handleSoloToggle = (trackId) => {
    setTracks(prevTracks => {
      // Verificar se a track já está em solo
      const track = prevTracks.find(t => t.id === trackId);
      const isSolo = track ? track.solo : false;
      
      if (isSolo) {
        // Se já estiver em solo, desativar o solo
        return prevTracks.map(t => 
          t.id === trackId ? { ...t, solo: false } : t
        );
      } else {
        // Se não estiver em solo, ativar o solo apenas para esta track
        return prevTracks.map(t => 
          t.id === trackId ? { ...t, solo: true } : { ...t, solo: false }
        );
      }
    });
  };
  
  return (
    <Container maxWidth="md" sx={{ height: '100vh', py: 3 }}>
      <PlayerContainer elevation={3}>
        <SongInfoContainer>
          <Typography variant="h5" gutterBottom>
            Santo - Comunhão
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, color: '#aaa', fontSize: 14 }}>
            <Typography variant="body2">Tonalidade: D</Typography>
            <Typography variant="body2">BPM: 120</Typography>
            <Typography variant="body2">Tempo Comum</Typography>
          </Box>
          
          <Timeline 
            currentTime={currentTime} 
            duration={duration}
            onSeek={handleSeek}
            markers={markers}
            onMarkerClick={handleMarkerClick}
          />
          
          <Controls 
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            onPlay={handlePlay}
            onPause={handlePause}
            onRewind={handleRewind}
            onForward={handleForward}
            onPrevMarker={handlePrevMarker}
            onNextMarker={handleNextMarker}
          />
        </SongInfoContainer>
        
        <TabsContainer>
          <StyledTabs
            value={currentTab}
            onChange={handleTabChange}
            variant="fullWidth"
          >
            <StyledTab label="Tracks" />
            <StyledTab label="Marcações" />
            <StyledTab label="Letra" />
            <StyledTab label="Cifra" />
          </StyledTabs>
        </TabsContainer>
        
        <TracksContainer>
          {currentTab === 0 && (
            <>
              {tracks.map(track => (
                <TrackItem 
                  key={track.id}
                  track={track}
                  onVolumeChange={handleVolumeChange}
                  onMuteToggle={handleMuteToggle}
                  onSoloToggle={handleSoloToggle}
                />
              ))}
            </>
          )}
          
          {currentTab === 1 && (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Marcações
              </Typography>
              {markers.map((marker, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 1, 
                    p: 1,
                    cursor: 'pointer',
                    borderLeft: `4px solid ${marker.color}`,
                    '&:hover': { backgroundColor: '#333' }
                  }}
                  onClick={() => handleMarkerClick(marker)}
                >
                  <Typography sx={{ flex: 1 }}>
                    {marker.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {Math.floor(marker.time / 60)}:{(marker.time % 60).toString().padStart(2, '0')}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
          
          {currentTab === 2 && (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Letra
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                Santo, Santo, Santo
                Senhor Deus do universo
                O céu e a terra proclamam a vossa glória
                
                Hosana nas alturas
                Bendito o que vem em nome do Senhor
                Hosana nas alturas
              </Typography>
            </Box>
          )}
          
          {currentTab === 3 && (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Cifra
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', whiteSpace: 'pre' }}>
{`D                 G
Santo, Santo, Santo
A                      D
Senhor Deus do universo
G                      A          
O céu e a terra proclamam 
         D
a vossa glória

G       A      Bm
Hosana nas alturas
G           A              D
Bendito o que vem em nome do Senhor
G       A      D
Hosana nas alturas`}
              </Typography>
            </Box>
          )}
        </TracksContainer>
      </PlayerContainer>
    </Container>
  );
};

export default PlayerPage;