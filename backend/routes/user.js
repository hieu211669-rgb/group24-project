// routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { getUsers, deleteUser } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

router.post('/user', userController.createUser);
router.put('/user/:id', userController.updateUser); // PUT
// GET: danh sách user (Admin only)
router.get('/', auth, role('admin'), getUsers);
// DELETE: xóa user (Admin hoặc chính user)
router.delete('/:id', auth, deleteUser);

module.exports = router;
