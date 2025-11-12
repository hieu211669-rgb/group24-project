const User = require('../models/User');
const bcrypt = require('bcrypt');

// Lấy profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Cập nhật profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, password } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });
    res.json({ msg: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Xóa profile
exports.deleteProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Upload avatar
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

    const avatarPath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    await User.findByIdAndUpdate(req.user.id, { avatar: avatarPath });

    res.json({ msg: 'Avatar uploaded successfully', avatar: avatarPath });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};