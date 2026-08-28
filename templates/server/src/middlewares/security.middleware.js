const helmet = require('helmet');
const cors = require('cors');
const securityConfig = require('../config/security');

/**
 * Helmet Middleware
 * Sets secure HTTP headers out of the box.
 */
const helmetMiddleware = helmet({
  // Disable features that might break local development or standard APIs if misconfigured
  crossOriginResourcePolicy: { policy: "cross-origin" }
});

/**
 * CORS Middleware
 * Configures Cross-Origin Resource Sharing.
 */
const corsMiddleware = cors(securityConfig.cors);

module.exports = {
  helmetMiddleware,
  corsMiddleware,
};
