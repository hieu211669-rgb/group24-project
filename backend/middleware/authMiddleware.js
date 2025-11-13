const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Lấy header Authorization: "Bearer <token>"
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'No token provided, authorization denied' });
    }

    try {
        // Giải mã token bằng ACCESS_TOKEN_SECRET
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Lưu thông tin user vào req để các route sau sử dụng
        req.user = decoded;

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ msg: 'Access token expired' });
        } else if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({ msg: 'Invalid token' });
        } else {
        return res.status(500).json({ msg: 'Token verification failed' });
        }
    }
};
