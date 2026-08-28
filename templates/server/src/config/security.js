/**
 * Security Configuration Settings
 */
module.exports = {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
  rateLimit: {
    windowMs: process.env.RATE_LIMIT_WINDOW_MS ? parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) : 15 * 60 * 1000, // 15 minutes
    max: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX, 10) : 100, // Limit each IP to 100 requests per `window`
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again later.',
    },
  },
  bodyParser: {
    limit: process.env.BODY_LIMIT || '10kb',
  },
};
