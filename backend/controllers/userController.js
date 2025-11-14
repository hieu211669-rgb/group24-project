const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Lấy danh sách user
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Admin tạo user mới
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const newUser = new User({ name, email, password: hashed, role });
  await newUser.save();

  res.status(201).json({
    name,
    email,
    role
  });
};

// Admin cập nhật user
exports.updateUser = async (req, res) => {
  const { id } = req.params; // id user cần update
  const { name, email, role, password } = req.body;

  try {
    // Tìm user theo id
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Cập nhật thông tin
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();

    // Tạo accessToken mới nếu role thay đổi
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      msg: 'User updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken, // trả về token mới
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

exports.updateSelf = async (req, res) => {
  const { name, email, password } = req.body;

  const updateData = { name, email };

  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    updateData.password = hashed;
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
  } catch (err) {
    // lỗi trùng email
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Email already used by another account' });
    }

    res.status(500).json({ msg: err.message });
  }
};


// Xóa user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Admin hoặc chính mình mới được xóa
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    await User.findByIdAndDelete(userId);

    res.json({ msg: 'User deleted successfully' });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
