const { verifyAccessToken } = require('../services/token.service');

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyAccessToken(token);

  if (!decoded) {
    return res.status(401).json({ success: false, message: 'Invalid or expired access token' });
  }

  // Attach user id to request
  req.user = { id: decoded.id };
  next();
};

module.exports = { requireAuth };
