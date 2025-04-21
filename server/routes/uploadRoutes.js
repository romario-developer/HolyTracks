const express = require('express');
const { check } = require('express-validator');
const { 
  uploadTrack, 
  uploadMultipleTracks, 
  deleteTrack, 
  getDownloadUrl 
} = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Proteger todas as rotas
router.use(protect);

// Upload de um único arquivo
router.post(
  '/',
  upload.single('file'),
  [
    check('type', 'Tipo deve ser válido').optional().isIn(['drums', 'bass', 'guitar', 'acoustic', 'keys', 'pads', 'fx', 'vocals', 'other'])
  ],
  uploadTrack
);

// Upload de múltiplos arquivos
router.post(
  '/multiple',
  upload.array('files', 10), // Limite de 10 arquivos por vez
  uploadMultipleTracks
);

// Excluir um arquivo
router.delete('/:id', deleteTrack);

// Obter URL para download
router.get('/:id/download', getDownloadUrl);

module.exports = router;