import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Grid, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  Chip,
  Typography,
  styled
} from '@mui/material';
import { useSongContext } from '../../context/SongContext';

// Estilização dos chips para tempo litúrgico
const TempoChip = styled(Chip)(({ theme, selected }) => ({
  margin: theme.spacing(0.5),
  borderRadius: 20,
  backgroundColor: selected ? theme.palette.primary.main : 'white',
  color: selected ? 'white' : theme.palette.text.primary,
  border: `1px solid ${selected ? theme.palette.primary.main : '#ddd'}`,
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: selected ? theme.palette.primary.main : 'rgba(33, 150, 243, 0.05)'
  }
}));

// Opções para os selects
const keyOptions = [
  { value: 'C', label: 'C (Dó maior)' },
  { value: 'C#', label: 'C# (Dó sustenido maior)' },
  { value: 'D', label: 'D (Ré maior)' },
  { value: 'D#', label: 'D# (Ré sustenido maior)' },
  { value: 'E', label: 'E (Mi maior)' },
  { value: 'F', label: 'F (Fá maior)' },
  { value: 'F#', label: 'F# (Fá sustenido maior)' },
  { value: 'G', label: 'G (Sol maior)' },
  { value: 'G#', label: 'G# (Sol sustenido maior)' },
  { value: 'A', label: 'A (Lá maior)' },
  { value: 'A#', label: 'A# (Lá sustenido maior)' },
  { value: 'B', label: 'B (Si maior)' }
];

const timeSignatureOptions = [
  { value: '4/4', label: '4/4' },
  { value: '3/4', label: '3/4' },
  { value: '6/8', label: '6/8' },
  { value: '2/4', label: '2/4' },
  { value: '5/4', label: '5/4' }
];

const tempoOptions = [
  { value: 'comum', label: 'Tempo Comum' },
  { value: 'quaresma', label: 'Quaresma' },
  { value: 'pascoa', label: 'Páscoa' },
  { value: 'advento', label: 'Advento' },
  { value: 'natal', label: 'Natal' }
];

const SongForm = () => {
  const { currentSong, updateSongData } = useSongContext();
  
  // Manipular mudanças nos campos de texto
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateSongData({ [name]: value });
  };
  
  // Manipular seleção do tempo litúrgico
  const handleTempoSelect = (tempo) => {
    updateSongData({ tempo });
  };
  
  return (
    <Box sx={{ mt: 3 }}>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <TextField
          label="Nome da música"
          name="title"
          placeholder="Ex: Santo - Comunhão"
          value={currentSong.title}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
        />
      </FormControl>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="key-label">Tonalidade</InputLabel>
            <Select
              labelId="key-label"
              name="key"
              value={currentSong.key}
              label="Tonalidade"
              onChange={handleInputChange}
            >
              <MenuItem value=""><em>Selecionar tonalidade</em></MenuItem>
              {keyOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <TextField
            label="BPM"
            name="bpm"
            type="number"
            placeholder="Ex: 120"
            value={currentSong.bpm}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="time-signature-label">Compasso</InputLabel>
            <Select
              labelId="time-signature-label"
              name="timeSignature"
              value={currentSong.timeSignature}
              label="Compasso"
              onChange={handleInputChange}
            >
              <MenuItem value=""><em>Selecionar compasso</em></MenuItem>
              {timeSignatureOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Tempo Litúrgico
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          {tempoOptions.map(option => (
            <TempoChip
              key={option.value}
              label={option.label}
              clickable
              selected={currentSong.tempo === option.value}
              onClick={() => handleTempoSelect(option.value)}
            />
          ))}
        </Box>
      </Box>
      
      <FormControl fullWidth sx={{ mb: 3 }}>
        <TextField
          label="Observações"
          name="notes"
          multiline
          rows={3}
          placeholder="Notas adicionais sobre a música..."
          value={currentSong.notes}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
        />
      </FormControl>
    </Box>
  );
};

export default SongForm;