const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getProfile, updateProfile, uploadAvatar } = require('../controllers/profileController');
const upload = require('../middleware/multer');



// GET: Xem thông tin cá nhân
router.get('/', auth, getProfile);
// PUT: Cập nhật thông tin cá nhân
router.put('/', auth, updateProfile);
// POST: upload avatar
router.post('/upload-avatar', auth, upload.single('avatar'), uploadAvatar);

module.exports = router;