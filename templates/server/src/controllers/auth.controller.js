const authService = require('../services/auth.service');
const authConfig = require('../config/auth');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    await authService.register(name, email, password);
    
    return res.status(201).json({
      success: true,
      message: 'User registered successfully'
    });
  } catch (error) {
    if (error.isDuplicate) {
      // Safe error for duplicate emails
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    
    // Set HttpOnly cookie for refresh token
    res.cookie('refreshToken', result.refreshToken, authConfig.cookieOptions);

    return res.json({
      success: true,
      accessToken: result.accessToken,
      user: result.user
    });
  } catch (error) {
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({ success: false, message: error.message });
    }
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token missing' });
    }

    const result = await authService.refresh(refreshToken);
    
    res.cookie('refreshToken', result.refreshToken, authConfig.cookieOptions);

    return res.json({
      success: true,
      accessToken: result.accessToken
    });
  } catch (error) {
    res.clearCookie('refreshToken');
    return res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    await authService.logout(refreshToken);
    
    res.clearCookie('refreshToken');
    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    return res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe
};
