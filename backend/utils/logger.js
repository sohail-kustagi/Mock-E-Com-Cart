const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require('winston');

// Start with a console transport, which works everywhere
const transportList = [
  new transports.Console({
    format: format.combine(
      format.colorize(),
      format.printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} ${level}: ${stack || message}`;
      })
    ),
  }),
];

// --- Vercel Fix ---
// Only add the File transport if we are NOT in production
if (process.env.NODE_ENV !== 'production') {
  const logDir = path.join(__dirname, '..', 'logs');
  
  // Only create the directory if we are NOT in production
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // Only add file logging if we are NOT in production
  transportList.push(
    new transports.File({
      filename: path.join(logDir, 'app.log'),
    })
  );
}

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: transportList, // Use our new dynamic list
});

logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

module.exports = logger;
