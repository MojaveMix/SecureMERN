const { User } = require('../models');
const tokenService = require('./token.service');

const register = async (name, email, password) => {
  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    // We intentionally throw a custom error to handle in controller cleanly
    const error = new Error('Email already registered');
    error.isDuplicate = true;
    throw error;
  }

  // Create user (password hashing is handled by model hooks)
  await User.create({ name, email, password });
};

const login = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  
  // Use generic error for security
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isValidPassword = await user.checkPassword(password);
  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }

  const accessToken = tokenService.generateAccessToken(user.id);
  const refreshToken = tokenService.generateRefreshToken(user.id);

  await tokenService.storeRefreshToken(user.id, refreshToken);

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email }
  };
};

const refresh = async (refreshToken) => {
  const storedToken = await tokenService.validateRefreshToken(refreshToken);
  
  if (!storedToken) {
    throw new Error('Invalid or expired refresh token');
  }

  // Rotate token (revoke old, issue new) for better security
  await storedToken.update({ revokedAt: new Date() });

  const newAccessToken = tokenService.generateAccessToken(storedToken.userId);
  const newRefreshToken = tokenService.generateRefreshToken(storedToken.userId);

  await tokenService.storeRefreshToken(storedToken.userId, newRefreshToken);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

const logout = async (refreshToken) => {
  if (refreshToken) {
    await tokenService.revokeRefreshToken(refreshToken);
  }
};

const getCurrentUser = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'name', 'email'] // Specifically exclude password
  });
  
  if (!user) throw new Error('User not found');
  return user;
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  getCurrentUser
};
