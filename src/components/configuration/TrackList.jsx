import React, { useEffect } from 'react';
import { 
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  FormControl,
  Select,
  MenuItem,
  styled
} from '@mui/material';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import { useSongContext } from '../../context/SongContext';

// Estilos personalizados
const TrackItem = styled(ListItem)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  backgroundColor: '#f9f9f9',
  borderRadius: 4
}));

const TrackIcon = styled(ListItemIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  minWidth: 'auto',
  marginRight: theme.spacing(2)
}));

// Opções de instrumentos
const instrumentOptions = [
  { value: 'drums', label: 'Bateria' },
  { value: 'bass', label: 'Baixo' },
  { value: 'guitar', label: 'Guitarra' },
  { value: 'acoustic', label: 'Violão' },
  { value: 'keys', label: 'Teclado' },
  { value: 'pads', label: 'Pads' },
  { value: 'fx', label: 'Efeitos' },
  { value: 'vocals', label: 'Vocais' }
];

// Funções de utilidade
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  else return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

// Componente para identificar o tipo de instrumento a partir do nome do arquivo
const getInstrumentType = (fileName) => {
  fileName = fileName.toLowerCase();
  
  if (fileName.includes('bateria') || fileName.includes('drum')) return 'drums';
  if (fileName.includes('baixo') || fileName.includes('bass')) return 'bass';
  if (fileName.includes('guitarra')) return 'guitar';
  if (fileName.includes('violao') || fileName.includes('violão')) return 'acoustic';
  if (fileName.includes('teclado') || fileName.includes('piano') || fileName.includes('keys')) return 'keys';
  if (fileName.includes('pad')) return 'pads';
  if (fileName.includes('fx') || fileName.includes('efeito')) return 'fx';
  if (fileName.includes('voz') || fileName.includes('vocal')) return 'vocals';
  
  return '';
};

const TrackList = () => {
  const { audioFiles, currentSong, updateTrack, addTracks } = useSongContext();
  
  // Configurar as tracks iniciais baseadas nos arquivos carregados
  useEffect(() => {
    if (audioFiles.length > 0 && currentSong.tracks.length === 0) {
      const tracksFromFiles = audioFiles.map(file => {
        const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove a extensão
        return {
          name: fileName,
          type: getInstrumentType(fileName),
          file: file,
          fileSize: formatFileSize(file.size)
        };
      });
      
      addTracks(tracksFromFiles);
    }
  }, [audioFiles, currentSong.tracks.length, addTracks]);
  
  // Manipular mudança de tipo de instrumento
  const handleInstrumentChange = (index, event) => {
    updateTrack(index, { type: event.target.value });
  };
  
  // Se não houver tracks, mostrar mensagem
  if (!currentSong.tracks.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Nenhuma track identificada. Por favor, carregue arquivos de áudio.
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Tracks identificadas
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Verifique se as tracks foram corretamente identificadas:
      </Typography>
      
      <List sx={{ mt: 2 }}>
        {currentSong.tracks.map((track, index) => (
          <TrackItem key={index}>
            <TrackIcon>
              <AudiotrackIcon />
            </TrackIcon>
            
            <ListItemText
              primary={track.name}
              secondary={`Arquivo: ${track.file?.name || track.name} (${track.fileSize || '?'})`}
            />
            
            <FormControl variant="outlined" size="small" sx={{ width: 150 }}>
              <Select
                value={track.type || ''}
                onChange={(e) => handleInstrumentChange(index, e)}
                displayEmpty
              >
                <MenuItem value=""><em>Selecionar</em></MenuItem>
                {instrumentOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </TrackItem>
        ))}
      </List>
    </Box>
  );
};

export default TrackList;