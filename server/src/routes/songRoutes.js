const express = require('express');
const router = express.Router();
const { 
  getAllSongs, 
  getSongById, 
  createSong, 
  updateSong, 
  deleteSong,
  uploadTrack,
  addTrack,
  removeTrack
} = require('../controllers/songController');
const { protect } = require('../middleware/auth');

// Rotas públicas
router.get('/', getAllSongs);
router.get('/:id', getSongById);

// Rotas protegidas
router.post('/', protect, createSong);
router.put('/:id', protect, updateSong);
router.delete('/:id', protect, deleteSong);

// Rotas para tracks
router.post('/tracks', protect, uploadTrack, addTrack);
router.delete('/:songId/tracks/:trackId', protect, removeTrack);

module.exports = router;