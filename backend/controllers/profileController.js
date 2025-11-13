const User = require('../models/User');
const bcrypt = require('bcrypt');
const cloudinary = require('../utils/cloudinary')
const streamifier = require('streamifier');
const sharp = require('sharp');

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

// helper: upload buffer to Cloudinary via upload_stream
function uploadBufferToCloudinary(buffer, folder = 'avatars') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

// POST /api/users/avatar
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) return res.status(400).json({ msg: 'No file uploaded' });

    // 1. dùng sharp để resize/crop/convert
    // ví dụ: resize tới 300x300, crop center, convert to jpeg, quality 80
    const processedBuffer = await sharp(req.file.buffer)
      .resize(300, 300, { fit: sharp.fit.cover })
      .jpeg({ quality: 80 })
      .toBuffer();

    // 2. upload buffer lên Cloudinary
    const result = await uploadBufferToCloudinary(processedBuffer, 'group-avatars');

    // 3. lưu url vào user
    const user = await User.findById(req.user.id);
    user.avatar = result.secure_url;
    await user.save();

    return res.json({ msg: 'Avatar uploaded', avatar: result.secure_url, cloudinary: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message || 'Upload failed' });
  }
};