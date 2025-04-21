const express = require('express');
const { check } = require('express-validator');
const { register, login, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Rota de registro
router.post(
  '/register',
  [
    check('name', 'Nome é obrigatório').not().isEmpty(),
    check('email', 'Por favor, inclua um email válido').isEmail(),
    check('password', 'Por favor, entre com uma senha com 6 ou mais caracteres').isLength({ min: 6 })
  ],
  register
);

// Rota de login
router.post(
  '/login',
  [
    check('email', 'Por favor, inclua um email válido').isEmail(),
    check('password', 'Senha é obrigatória').exists()
  ],
  login
);

// Rota para obter o usuário atual
router.get('/me', protect, getMe);

// Rota de logout
router.get('/logout', protect, logout);

module.exports = router;