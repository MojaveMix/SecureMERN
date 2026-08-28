/**
 * Environment Validation
 * Ensures that all required environment variables are present before starting the server.
 */

const requiredVars = [
  'NODE_ENV',
  'PORT',
  'CLIENT_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET'
];

const validateEnv = () => {
  const missingVars = requiredVars.filter(envVar => !process.env[envVar]);

  if (missingVars.length > 0) {
    console.error('❌ Invalid environment configuration.');
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
  }
};

module.exports = { validateEnv };
