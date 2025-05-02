const express = require('express');
const router = express.Router();
const { 
  getAllSongs, 
  getSongById, 
  createSong, 
  updateSong, 
  deleteSong 
} = require('../controllers/songController');
const { protect, authorize } = require('../middleware/auth');

// Rotas públicas 
router.get('/', getAllSongs); 
router.get('/:id', getSongById); 

// Rotas protegidas 
router.post('/', protect, createSong); 
router.put('/:id', protect, updateSong); 
router.delete('/:id', protect, deleteSong); 

module.exports = router;