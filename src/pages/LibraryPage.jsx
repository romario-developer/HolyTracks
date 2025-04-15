import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid, 
  Chip, 
  TextField, 
  InputAdornment, 
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Paper,
  styled 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

// Estilização personalizada
const LibraryContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: 8,
  padding: theme.spacing(3),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4)
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
  flexWrap: 'wrap'
}));

const SongCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: 'transform 0.2s',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4]
  }
}));

const SongCardMedia = styled(Box)(({ theme }) => ({
  backgroundColor: '#333',
  height: 140,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white'
}));

const SongInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1)
}));

const ChipContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(1)
}));

// Dados de exemplo para músicas
const sampleSongs = [
  {
    id: 1,
    title: 'Santo - Comunhão',
    key: 'D',
    bpm: 120,
    tempo: 'comum',
    tracks: ['bateria', 'baixo', 'guitarra', 'teclado'],
    dateAdded: '2023-08-10'
  },
  {
    id: 2,
    title: 'Eis-me Aqui',
    key: 'G',
    bpm: 85,
    tempo: 'quaresma',
    tracks: ['violão', 'baixo', 'teclado', 'voz'],
    dateAdded: '2023-07-22'
  },
  {
    id: 3,
    title: 'Aleluia',
    key: 'C',
    bpm: 90,
    tempo: 'pascal',
    tracks: ['bateria', 'violão', 'baixo', 'voz'],
    dateAdded: '2023-07-15'
  },
  {
    id: 4,
    title: 'Pai Nosso',
    key: 'E',
    bpm: 75,
    tempo: 'comum',
    tracks: ['violão', 'teclado', 'voz'],
    dateAdded: '2023-06-30'
  },
  {
    id: 5,
    title: 'Cordeiro de Deus',
    key: 'A',
    bpm: 70,
    tempo: 'comum',
    tracks: ['baixo', 'violão', 'teclado'],
    dateAdded: '2023-06-20'
  },
  {
    id: 6,
    title: 'Canto de Entrada - Advento',
    key: 'F',
    bpm: 95,
    tempo: 'advento',
    tracks: ['bateria', 'baixo', 'violão', 'teclado', 'voz'],
    dateAdded: '2023-05-15'
  }
];

// Função para obter cor baseada no tempo litúrgico
const getTempoColor = (tempo) => {
  const colors = {
    comum: '#4CAF50',
    quaresma: '#9C27B0',
    pascal: '#FFC107',
    advento: '#2196F3',
    natal: '#F44336'
  };
  
  return colors[tempo] || '#757575';
};

// Função para obter label do tempo litúrgico
const getTempoLabel = (tempo) => {
  const labels = {
    comum: 'Tempo Comum',
    quaresma: 'Quaresma',
    pascal: 'Páscoa',
    advento: 'Advento',
    natal: 'Natal'
  };
  
  return labels[tempo] || tempo;
};

const LibraryPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTempo, setFilterTempo] = useState('');
  const [sortOrder, setSortOrder] = useState('recent');
  
  // Função para lidar com a pesquisa
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  // Função para lidar com filtro de tempo litúrgico
  const handleTempoChange = (event) => {
    setFilterTempo(event.target.value);
  };
  
  // Função para lidar com ordenação
  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };
  
  // Abrir uma música no player
  const openSong = (songId) => {
    navigate(`/player/${songId}`);
  };
  
  // Filtrar e ordenar músicas
  const filteredSongs = sampleSongs
    .filter(song => 
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterTempo === '' || song.tempo === filterTempo)
    )
    .sort((a, b) => {
      if (sortOrder === 'recent') {
        return new Date(b.dateAdded) - new Date(a.dateAdded);
      } else if (sortOrder === 'alphabetical') {
        return a.title.localeCompare(b.title);
      } else if (sortOrder === 'tempo') {
        return a.tempo.localeCompare(b.tempo);
      }
      return 0;
    });
  
  return (
    <Container maxWidth="lg">
      <LibraryContainer elevation={1}>
        <Typography variant="h4" gutterBottom>
          Minhas Músicas
        </Typography>
        
        <SearchContainer>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar música..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            sx={{ flex: 2 }}
          />
          
          <FormControl variant="outlined" sx={{ flex: 1, minWidth: 150 }}>
            <InputLabel id="tempo-filter-label">Tempo Litúrgico</InputLabel>
            <Select
              labelId="tempo-filter-label"
              value={filterTempo}
              onChange={handleTempoChange}
              label="Tempo Litúrgico"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="comum">Tempo Comum</MenuItem>
              <MenuItem value="quaresma">Quaresma</MenuItem>
              <MenuItem value="pascal">Páscoa</MenuItem>
              <MenuItem value="advento">Advento</MenuItem>
              <MenuItem value="natal">Natal</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl variant="outlined" sx={{ flex: 1, minWidth: 150 }}>
            <InputLabel id="sort-order-label">Ordenar por</InputLabel>
            <Select
              labelId="sort-order-label"
              value={sortOrder}
              onChange={handleSortChange}
              label="Ordenar por"
            >
              <MenuItem value="recent">Mais recentes</MenuItem>
              <MenuItem value="alphabetical">Nome</MenuItem>
              <MenuItem value="tempo">Tempo Litúrgico</MenuItem>
            </Select>
          </FormControl>
        </SearchContainer>
        
        <Divider sx={{ mb: 4 }} />
        
        <Grid container spacing={3}>
          {filteredSongs.map((song) => (
            <Grid item key={song.id} xs={12} sm={6} md={4} lg={3}>
              <SongCard onClick={() => openSong(song.id)}>
                <SongCardMedia>
                  <MusicNoteIcon sx={{ fontSize: 60, opacity: 0.7 }} />
                </SongCardMedia>
                
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {song.title}
                  </Typography>
                  
                  <SongInfo>
                    <Typography variant="body2" color="text.secondary">
                      Tonalidade: {song.key}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      BPM: {song.bpm}
                    </Typography>
                  </SongInfo>
                  
                  <ChipContainer>
                    <Chip 
                      label={getTempoLabel(song.tempo)} 
                      size="small" 
                      sx={{ 
                        backgroundColor: getTempoColor(song.tempo) + '20',
                        borderColor: getTempoColor(song.tempo),
                        color: getTempoColor(song.tempo),
                        borderWidth: 1,
                        borderStyle: 'solid'
                      }} 
                    />
                    
                    <Chip 
                      icon={<PlayCircleOutlineIcon />} 
                      label={`${song.tracks.length} tracks`} 
                      size="small" 
                      variant="outlined" 
                    />
                  </ChipContainer>
                </CardContent>
              </SongCard>
            </Grid>
          ))}
          
          {filteredSongs.length === 0 && (
            <Box sx={{ width: '100%', py: 5, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                Nenhuma música encontrada. Tente ajustar os filtros ou adicione novas músicas.
              </Typography>
            </Box>
          )}
        </Grid>
      </LibraryContainer>
    </Container>
  );
};

export default LibraryPage;