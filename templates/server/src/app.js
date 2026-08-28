const express = require('express');
const { helmetMiddleware, corsMiddleware } = require('./middlewares/security.middleware');
const { apiLimiter } = require('./middlewares/rate-limit.middleware');
const { notFoundHandler } = require('./middlewares/not-found.middleware');
const { errorHandler } = require('./middlewares/error.middleware');
const securityConfig = require('./config/security');
const healthRoutes = require('./routes/health.routes');

const app = express();

// 1. Security headers (Helmet)
app.use(helmetMiddleware);

// 2. Request parsing and limits
app.use(express.json({ limit: securityConfig.bodyParser.limit }));
app.use(express.urlencoded({ extended: true, limit: securityConfig.bodyParser.limit }));

// 3. CORS configuration
app.use(corsMiddleware);

// 4. Rate limiting
app.use('/api', apiLimiter);

// 5. Routes
app.use('/api/health', healthRoutes);

// 6. 404 Handler for unknown routes
app.use(notFoundHandler);

// 7. Centralized Error Handler
app.use(errorHandler);

module.exports = app;
