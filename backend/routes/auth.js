const express = require('express');
const router = express.Router();
const { signup, login, logout, forgotPassword, resetPassword } = require('../controllers/authController');
const { loginLimiter } = require('../middleware/rateLimit');
const logActivity = require('../middleware/logActivity');


router.post('/signup', logActivity, signup);
router.post('/login', loginLimiter, login, logActivity);
router.post('/logout', logout, logActivity);
router.post('/forgot-password', forgotPassword, logActivity);
router.post('/reset-password/:token', resetPassword, logActivity);

module.exports = router;