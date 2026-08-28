/**
 * Centralized Error Handling Middleware
 * Prevents leaking stack traces and sensitive details in production.
 */
const errorHandler = (err, req, res, next) => {
  console.error('[Error]', err);

  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    success: false,
    message: isProduction && statusCode === 500 ? 'Internal server error' : err.message,
    // Provide stack trace only in non-production environments
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

module.exports = { errorHandler };
