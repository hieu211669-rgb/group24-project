const User = require('../models/User');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;

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
        if (!req.files || !req.files.avatar) return res.status(400).json({ msg: 'No file uploaded' });


            const result = await cloudinary.uploader.upload(req.files.avatar.tempFilePath, {
            folder: 'avatars',
        });


        const updatedUser = await User.findByIdAndUpdate(req.user.id, { avatar: result.secure_url }, { new: true });
        res.json({ msg: 'Avatar uploaded successfully', avatar: updatedUser.avatar });
    } catch (err) {
    res.status(500).json({ msg: err.message });
    }
};

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

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