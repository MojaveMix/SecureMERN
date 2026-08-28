/**
 * 404 Not Found Middleware
 * Catches any requests that don't match an existing route.
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
};

module.exports = { notFoundHandler };
