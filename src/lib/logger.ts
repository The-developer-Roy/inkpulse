import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info', // Set the default log level
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.json() // Log in JSON format for structured logging
  ),
  transports: [
    new transports.Console(), // Logs to the console
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // Error logs
    new transports.File({ filename: 'logs/combined.log' }) // All logs
  ],
});

// If in development, use a human-readable format for console
if (process.env.NODE_ENV === 'development') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

export default logger;