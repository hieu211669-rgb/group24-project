const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/profileController');


// GET: Xem thông tin cá nhân
router.get('/', auth, getProfile);


// PUT: Cập nhật thông tin cá nhân
router.put('/', auth, updateProfile);


module.exports = router;