const User = require('../models/User');
const bcrypt = require('bcrypt');

// Lấy thông tin cá nhân
exports.getProfile = async (req, res) => {
try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
    res.status(500).json({ msg: err.message });
    }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

    // Lưu link file vào DB (chỉ đường dẫn local)
    const avatarPath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    await User.findByIdAndUpdate(req.user.id, { avatar: avatarPath });

    res.json({ msg: 'Avatar uploaded successfully', avatar: avatarPath });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Cập nhật thông tin cá nhân
exports.updateProfile = async (req, res) => {
    try {
        const { name, password } = req.body;
        const updateData = {};
    if (name) updateData.name = name;
    if (password) {
        const hashed = await bcrypt.hash(password, 10);
        updateData.password = hashed;
    }
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-password');
    res.json({ msg: 'Profile updated successfully', user: updatedUser });
    } catch (err) {
    res.status(500).json({ msg: err.message });
    }
};