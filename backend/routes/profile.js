const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');
const { getProfile, updateProfile, deleteProfile, uploadAvatar } = require('../controllers/profileController');
const logActivity = require('../middleware/logActivity');

// Lấy thông tin user
router.get('/', auth, logActivity, getProfile);

// Cập nhật profile (name, password...)
router.put('/', auth, logActivity, updateProfile);

// Xóa user (tự xóa)
router.delete('/', auth, logActivity, deleteProfile);

// Upload avatar
router.post('/upload-avatar', auth, upload.single('avatar'), uploadAvatar);

module.exports = router;
