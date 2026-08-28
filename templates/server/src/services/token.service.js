const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const authConfig = require('../config/auth');
const { RefreshToken } = require('../models');

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, authConfig.jwtAccessSecret, {
    expiresIn: authConfig.jwtAccessExpiresIn,
  });
};

const generateRefreshToken = (userId) => {
  // We can use random bytes for the actual token to avoid large JWT overhead in DB
  // Or we can issue a JWT. Let's issue a random string for simplicity and security.
  const rawToken = crypto.randomBytes(40).toString('hex');
  return rawToken;
};

const hashRefreshToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const storeRefreshToken = async (userId, token) => {
  const tokenHash = hashRefreshToken(token);
  // Calculate expiration date (7 days from now)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    userId,
    tokenHash,
    expiresAt,
  });
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, authConfig.jwtAccessSecret);
  } catch (error) {
    return null; // Invalid or expired
  }
};

const validateRefreshToken = async (token) => {
  const tokenHash = hashRefreshToken(token);
  const storedToken = await RefreshToken.findOne({
    where: { tokenHash }
  });

  if (!storedToken) return null;
  if (storedToken.revokedAt) return null;
  if (storedToken.expiresAt < new Date()) return null;

  return storedToken;
};

const revokeRefreshToken = async (token) => {
  const tokenHash = hashRefreshToken(token);
  await RefreshToken.update(
    { revokedAt: new Date() },
    { where: { tokenHash } }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  storeRefreshToken,
  verifyAccessToken,
  validateRefreshToken,
  revokeRefreshToken
};
