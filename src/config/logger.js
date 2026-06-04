const { createLogger, format, transports } = require('winston');

const { combine, timestamp, colorize, printf, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),    // captures full stack trace on errors
    logFormat
  ),
  transports: [
    new transports.Console({
      format: combine(colorize(), logFormat)  // colorized output in terminal
    }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ],
});

module.exports = logger;

/* Any file that needs logging just imports the module

const logger = require('./src/config/logger');

logger.info('Something happened');
logger.warn('Something seems off');
logger.error('Something broke', new Error('details here'));
logger.debug('Verbose detail for development');

*/