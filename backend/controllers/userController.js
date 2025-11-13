const User = require('../models/User');

// Lấy danh sách user (Admin + Moderator)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Cập nhật role của user (chỉ Admin)
exports.updateUserRole = async (req, res) => {
  const { role } = req.body;

  if (!['User', 'Admin'].includes(role)) {
    return res.status(400).json({ msg: 'Invalid role' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Tạo user mới
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const newUser = new User({ name, email, password, role: role || 'User' });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Cập nhật user (PUT)
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    // Nếu role là User mà id khác id trong token → chặn
    if (req.user.role === 'user' && req.user.id !== id) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ msg: 'User not found' });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    if (req.user.role !== 'Admin' && req.user._id.toString() !== userId) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ msg: 'User not found' });

    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
