import winston from 'winston';

const NODE_ENV = process.env.NODE_ENV || 'development';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const SERVICE_NAME = process.env.SERVICE_NAME || 'express-app';
const SERVICE_VERSION = process.env.SERVICE_VERSION || '1.0.0';

// Custom format for log shippers
const logShipperFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, service, version, environment, ...meta }) => {
    return JSON.stringify({
      '@timestamp': timestamp,
      level,
      message,
      service,
      version,
      environment,
      ...meta
    });
  })
);

// Development format (human readable)
const developmentFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, requestId, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    const reqId = requestId ? `[${requestId.slice(0, 8)}]` : '';
    return `${timestamp} ${level} ${reqId} ${message} ${metaStr}`;
  })
);

// Create logger instance
export const logger = winston.createLogger({
  level: LOG_LEVEL,
  defaultMeta: {
    service: SERVICE_NAME,
    version: SERVICE_VERSION,
    environment: NODE_ENV,
    hostname: process.env.HOSTNAME || 'unknown',
    pid: process.pid
  },
  transports: [
    new winston.transports.Console({
      format: NODE_ENV === 'production' ? logShipperFormat : developmentFormat
    })
  ],
  // Handle uncaught exceptions and rejections
  exceptionHandlers: [
    new winston.transports.Console({
      format: logShipperFormat
    })
  ],
  rejectionHandlers: [
    new winston.transports.Console({
      format: logShipperFormat
    })
  ]
});

// Add file transport for production if needed
if (NODE_ENV === 'production' && process.env.LOG_TO_FILE === 'true') {
  logger.add(new winston.transports.File({
    filename: '/var/log/app/error.log',
    level: 'error',
    format: logShipperFormat,
    maxsize: 100 * 1024 * 1024, // 100MB
    maxFiles: 5
  }));
  
  logger.add(new winston.transports.File({
    filename: '/var/log/app/combined.log',
    format: logShipperFormat,
    maxsize: 100 * 1024 * 1024, // 100MB
    maxFiles: 10
  }));
}

// Export helper functions for common log patterns
export const logError = (message, error, meta = {}) => {
  logger.error(message, {
    error: error.message,
    stack: error.stack,
    ...meta
  });
};

export const logRequest = (req, res, duration) => {
  logger.info('Request completed', {
    requestId: req.id,
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    duration: `${duration}ms`,
    userAgent: req.headers['user-agent'],
    ip: req.ip || req.connection.remoteAddress
  });
};

export default logger;