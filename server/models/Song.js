const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Por favor, informe um título para a música'],
    trim: true,
    maxlength: [100, 'Título não pode ter mais de 100 caracteres']
  },
  key: {
    type: String,
    required: [true, 'Por favor, informe a tonalidade'],
    trim: true
  },
  bpm: {
    type: Number,
    required: [true, 'Por favor, informe o BPM']
  },
  timeSignature: {
    type: String,
    required: [true, 'Por favor, informe o compasso'],
    trim: true
  },
  tempo: {
    type: String,
    enum: ['comum', 'quaresma', 'pascoa', 'advento', 'natal'],
    required: [true, 'Por favor, informe o tempo litúrgico']
  },
  notes: {
    type: String,
    trim: true
  },
  lyrics: {
    type: String,
    trim: true
  },
  chords: {
    type: String,
    trim: true
  },
  markers: [
    {
      time: {
        type: Number,
        required: true
      },
      label: {
        type: String,
        required: true,
        trim: true
      },
      color: {
        type: String,
        default: '#ffeb3b'
      }
    }
  ],
  tracks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Track'
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índice para pesquisa por título
SongSchema.index({ title: 'text' });

module.exports = mongoose.model('Song', SongSchema);