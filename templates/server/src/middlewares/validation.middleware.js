/**
 * Validation Middleware
 * Uses Zod to validate incoming request body, query, and params.
 */
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request input',
      errors: err.errors,
    });
  }
};

module.exports = { validate };
