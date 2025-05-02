const express = require('express');
const router = express.Router();
const { 
  initBucket, 
  uploadToS3, 
  getDownloadUrl, 
  deleteFromS3 
} = require('../controllers/s3Controller');
const { protect, authorize } = require('../middleware/auth');
const { uploadS3 } = require('../config/s3');

// Inicializar bucket (apenas admin)
router.get('/init', protect, authorize('admin'), initBucket);

// Upload para S3
router.post('/upload', protect, uploadS3.single('file'), uploadToS3);

// Obter URL de download
router.get('/download/:songId/:trackId', protect, getDownloadUrl);

// Excluir arquivo do S3
router.delete('/:songId/:trackId', protect, deleteFromS3);

module.exports = router;