const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Por favor, informe o título da música'],
    trim: true
  },
  key: {
    type: String,
    required: false
  },
  bpm: {
    type: Number,
    required: false
  },
  timeSignature: {
    type: String,
    required: false
  },
  tempo: {
    type: String,
    enum: ['comum', 'quaresma', 'pascoa', 'advento', 'natal'],
    default: 'comum'
  },
  notes: {
    type: String,
    required: false
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tracks: [
    {
      name: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['drums', 'bass', 'guitar', 'acoustic', 'keys', 'pads', 'fx', 'vocals'],
        required: true
      },
      path: {
        type: String,
        required: true
      },
      volume: {
        type: Number,
        default: 80
      },
      muted: {
        type: Boolean,
        default: false
      },
      solo: {
        type: Boolean,
        default: false
      }
    }
  ],
  markers: [
    {
      time: {
        type: Number,
        required: true
      },
      label: {
        type: String,
        required: true
      },
      color: {
        type: String,
        default: '#2196F3'
      }
    }
  ],
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