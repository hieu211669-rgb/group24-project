const express = require('express');
const router = express.Router();
const { signup, login, logout, forgotPassword, resetPassword, refreshToken } = require('../controllers/authController');
const rateLimit = require('../middleware/rateLimit')

router.post('/signup', signup);
router.post('/login', rateLimit, login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/refresh', refreshToken);

module.exports = router;