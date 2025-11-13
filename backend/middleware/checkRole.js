// middleware/role.js
module.exports = function checkRole(requiredRole) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ msg: 'Unauthorized' });

    if (req.user.role !== requiredRole) {
      return res.status(403).json({ msg: 'Forbidden: insufficient role' });
    }

    next();
  };
};
