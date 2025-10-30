const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const rateLimiter = require('./middleware/rateLimiter');

// Load environment variables from .env
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB outside of tests
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Global middleware
app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use(
  morgan('combined', {
    stream: logger.stream,
    skip: () => process.env.NODE_ENV === 'test',
  })
);

// Health check endpoint for uptime monitoring
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Route registrations
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));

// Basic error handler to surface uncaught issues
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// Start server when executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

module.exports = app;
