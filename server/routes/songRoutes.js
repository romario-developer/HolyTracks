const express = require('express');
const { check } = require('express-validator');
const { 
  createSong, 
  getSongs, 
  getSongById, 
  updateSong, 
  deleteSong,
  addMarker,
  removeMarker
} = require('../controllers/songController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Proteger todas as rotas
router.use(protect);

// Rotas básicas
router.route('/')
  .post(
    [
      check('title', 'Título é obrigatório').not().isEmpty(),
      check('key', 'Tonalidade é obrigatória').not().isEmpty(),
      check('bpm', 'BPM é obrigatório').isNumeric(),
      check('timeSignature', 'Compasso é obrigatório').not().isEmpty(),
      check('tempo', 'Tempo litúrgico é obrigatório').isIn(['comum', 'quaresma', 'pascoa', 'advento', 'natal'])
    ],
    createSong
  )
  .get(getSongs);

// Rotas com ID específico
router.route('/:id')
  .get(getSongById)
  .put(
    [
      check('title', 'Título é obrigatório').optional().not().isEmpty(),
      check('key', 'Tonalidade é obrigatória').optional().not().isEmpty(),
      check('bpm', 'BPM é obrigatório').optional().isNumeric(),
      check('timeSignature', 'Compasso é obrigatório').optional().not().isEmpty(),
      check('tempo', 'Tempo litúrgico é obrigatório').optional().isIn(['comum', 'quaresma', 'pascoa', 'advento', 'natal'])
    ],
    updateSong
  )
  .delete(deleteSong);

// Rotas para marcadores
router.route('/:id/markers')
  .post(
    [
      check('time', 'Tempo é obrigatório').isNumeric(),
      check('label', 'Label é obrigatório').not().isEmpty()
    ],
    addMarker
  );

router.route('/:id/markers/:markerId')
  .delete(removeMarker);

module.exports = router;