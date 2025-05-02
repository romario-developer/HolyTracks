const mongoose = require('mongoose');

const TrackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor, adicione um nome para a faixa']
  },
  type: {
    type: String,
    enum: ['audio', 'sheet', 'lyrics', 'other'],
    default: 'audio'
  },
  path: {
    type: String,
    required: [true, 'Por favor, adicione um caminho para a faixa']
  },
  size: {
    type: Number,
    required: [true, 'Por favor, adicione um tamanho para a faixa']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Por favor, adicione um título para a música'],
    trim: true,
    maxlength: [100, 'O título não pode ter mais de 100 caracteres']
  },
  artist: {
    type: String,
    required: false,
    trim: true,
    maxlength: [100, 'O nome do artista não pode ter mais de 100 caracteres']
  },
  key: {
    type: String,
    required: false,
    trim: true,
    maxlength: [10, 'A tonalidade não pode ter mais de 10 caracteres']
  },
  bpm: {
    type: Number,
    required: false,
    min: [0, 'O BPM não pode ser negativo']
  },
  category: {
    type: String,
    required: false,
    enum: [
      'Entrada',
      'Ato Penitencial',
      'Glória',
      'Aclamação',
      'Ofertório',
      'Santo',
      'Comunhão',
      'Ação de Graças',
      'Final',
      'Outro'
    ]
  },
  description: {
    type: String,
    required: false,
    maxlength: [500, 'A descrição não pode ter mais de 500 caracteres']
  },
  tags: {
    type: [String],
    required: false
  },
  tracks: [TrackSchema],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Song', SongSchema);