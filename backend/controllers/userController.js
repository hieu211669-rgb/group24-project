const User = require('../models/User');

// Lấy danh sách user
exports.getUsers = async (req, res) => {
  try {
  const users = await User.find().select('-password');
  res.json(users);
  } catch (err) {
  res.status(500).json({ msg: err.message });
}
};

// Tạo user mới
exports.createUser = async (req, res) => {
  const { name, email } = req.body;
  const newUser = new User({ name, email });
  await newUser.save();
  res.status(201).json(newUser);
};

// Cập nhật user (PUT)
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true } // Trả về user đã cập nhật
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xóa user (DELETE)
exports.deleteUser = async (req, res) => {
  try {
  const userId = req.params.id;
  if (req.user.role !== 'admin' && req.user.id !== userId) {
  return res.status(403).json({ msg: 'Access denied' });
  }
  await User.findByIdAndDelete(userId);
  res.json({ msg: 'User deleted successfully' });
  } catch (err) {
  res.status(500).json({ msg: err.message });
}
};
