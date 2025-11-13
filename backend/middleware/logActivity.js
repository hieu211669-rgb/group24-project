const Log = require('../models/Log'); // collection logs

// Middleware ghi hoạt động
const logActivity = async (req, res, next) => {
  try {
    if (!req.user) return next(); // Nếu chưa login thì không log
    const action = `${req.method} ${req.originalUrl}`;
    const log = new Log({
      userId: req.user.id,
      action,
      timestamp: new Date()
    });
    await log.save();
  } catch (err) {
    console.error('Logging error:', err);
  }
  next();
};

module.exports = logActivity;
