const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');
const RefreshToken = require('../models/RefreshToken');

// ======= HÀM TẠO TOKEN ======= //
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE || '15m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d' }
  );
};

// ======= ĐĂNG KÝ ======= //
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ msg: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ msg: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ======= ĐĂNG NHẬP ======= //
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid password' });

    // Tạo Access Token và Refresh Token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Lưu refresh token vào DB
    
    await RefreshToken.create({ userId: user._id, token: refreshToken,   expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày
 });

    res.json({
      msg: 'Login successful',
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ======= REFRESH TOKEN ======= //
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ msg: 'Missing refresh token' });

  try {
    const stored = await RefreshToken.findOne({ token: refreshToken });
    if (!stored) return res.status(403).json({ msg: 'Invalid refresh token' });

    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ msg: 'Token expired or invalid' });
  }
};

// ======= ĐĂNG XUẤT ======= //
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ msg: 'Missing refresh token' });

    await RefreshToken.findOneAndDelete({ token: refreshToken });
    res.json({ msg: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ======= QUÊN MẬT KHẨU ======= //
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: 'User not found' });

  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const resetUrl = `http://localhost:3001/reset-password/${resetToken}`;
  await sendEmail(user.email, 'Reset Password', `Click to reset: ${resetUrl}`);

  res.json({ msg: 'Reset email sent' });
};

// ======= ĐẶT LẠI MẬT KHẨU ======= //
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashed = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(decoded.id, { password: hashed });
    res.json({ msg: 'Password reset successfully' });
  } catch (err) {
    res.status(400).json({ msg: 'Invalid or expired token' });
  }
};
