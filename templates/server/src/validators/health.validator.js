const { z } = require('zod');

// Simple example validator for the health endpoint (optional query param)
const healthQuerySchema = z.object({
  query: z.object({
    echo: z.string().optional(),
  }),
});

module.exports = { healthQuerySchema };
