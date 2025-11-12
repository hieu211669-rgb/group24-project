const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');

// Đăng ký
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


// Đăng nhập
exports.login = async (req, res) => {
try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid password' });


    const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
    );


    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
    res.status(500).json({ msg: err.message });
    }
};


// Đăng xuất (phía client sẽ xóa token)
exports.logout = (req, res) => {
    res.json({ msg: 'Logged out successfully (client should remove token)' });
res.json({ msg: 'Logged out successfully (client should remove token)' });
};

// Gửi email reset password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    await sendEmail(user.email, 'Reset Password', `Click to reset: ${resetUrl}`);
    res.json({ msg: 'Reset email sent' });
};

// Reset password với token
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