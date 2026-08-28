const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { validateEnv } = require('./config/env');

// Validate environment variables before starting the application
validateEnv();

const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
