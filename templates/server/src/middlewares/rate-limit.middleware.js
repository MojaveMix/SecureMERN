const rateLimit = require('express-rate-limit');
const securityConfig = require('../config/security');

/**
 * General API Rate Limiter
 * Note: Application-level rate limiting is only one layer of protection.
 * It does not fully prevent distributed attacks (DDoS).
 */
const apiLimiter = rateLimit({
  windowMs: securityConfig.rateLimit.windowMs,
  max: securityConfig.rateLimit.max,
  message: securityConfig.rateLimit.message,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = { apiLimiter };
