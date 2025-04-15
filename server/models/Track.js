const mongoose = require('mongoose');

const TrackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor, informe um nome para a track'],
    trim: true,
    maxlength: [50, 'Nome não pode ter mais de 50 caracteres']
  },
  type: {
    type: String,
    enum: ['drums', 'bass', 'guitar', 'acoustic', 'keys', 'pads', 'fx', 'vocals', 'other'],
    required: [true, 'Por favor, informe o tipo de instrumento']
  },
  fileUrl: {
    type: String,
    required: [true, 'Por favor, informe a URL do arquivo']
  },
  fileKey: {
    type: String,
    required: [true, 'Por favor, informe a chave do arquivo no S3']
  },
  fileSize: {
    type: Number,
    required: [true, 'Por favor, informe o tamanho do arquivo']
  },
  duration: {
    type: Number,
    required: [true, 'Por favor, informe a duração da track']
  },
  mimeType: {
    type: String,
    required: [true, 'Por favor, informe o tipo MIME do arquivo']
  },
  song: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Track', TrackSchema);