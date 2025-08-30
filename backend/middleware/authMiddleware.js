// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) return res.status(401).json({ msg: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid token' });
  }
}

function adminOnly(req, res, next) {
  if (!req.user) return res.status(401).json({ msg: 'Unauthorized' });
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin only' });
  next();
}

module.exports = { authMiddleware, adminOnly };
