const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 5, // tối đa 5 lần login trong 15 phút
  message: { msg: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = loginLimiter;