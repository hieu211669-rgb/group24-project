// routes/user.js
const express = require('express');
const router = express.Router();
const { createUser, updateUser, getUsers, deleteUser } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const Log = require('../models/Log');
const logActivity = require('../middleware/logActivity');
// Tạo user
router.post('/user', auth, logActivity, createUser);
// Cập nhật user
router.put('/user/:id', auth, logActivity, updateUser);
// Lấy danh sách user (admin)
router.get('/', auth, role('admin'), getUsers);
// Xóa user
router.delete('/:id', auth, logActivity, deleteUser);
// Lấy log hoạt động (admin)
router.get('/logs', auth, role('admin'), async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }).limit(50);
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Lỗi server khi lấy logs' });
  }
});

module.exports = router;
