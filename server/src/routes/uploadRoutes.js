const express = require('express');
const router = express.Router();
const { 
  uploadFile, 
  uploadMultipleFiles, 
  deleteFile, 
  getDownloadUrl 
} = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

// Rotas para upload de arquivos
router.post('/', protect, uploadFile);
router.post('/multiple', protect, uploadMultipleFiles);
router.delete('/:songId/:trackId', protect, deleteFile);
router.get('/download/:songId/:trackId', getDownloadUrl);

module.exports = router;