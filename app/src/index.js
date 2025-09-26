import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger, logError, logRequest } from './logger.js';

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const SERVICE_NAME = process.env.SERVICE_NAME || 'containership';
const SERVICE_VERSION = process.env.SERVICE_VERSION || '1.0.0';

app.use(express.json());

// Request ID middleware for tracing
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || uuidv4();
  res.setHeader('x-request-id', req.id);
  next();
});

// Structured logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  
  // Log incoming request
  logger.info('Incoming request', {
    requestId: req.id,
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent'],
    ip: req.ip || req.connection.remoteAddress,
    headers: {
      'content-type': req.headers['content-type'],
      'authorization': req.headers.authorization ? '[REDACTED]' : undefined
    }
  });
  
  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - startTime;
    logRequest(req, this, duration);
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
});

app.get('/', (req, res) => {
    logger.info('Root endpoint accessed', { requestId: req.id });
    res.send({ 
        message: 'This is for kubernetes deployment',
        requestId: req.id,
        timestamp: new Date().toISOString()
    });
});

app.get("/health", (req, res) => {
    const healthData = {
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        requestId: req.id
    };
    
    logger.info('Health check accessed', { 
        requestId: req.id, 
        uptime: healthData.uptime,
        memoryUsage: healthData.memory.heapUsed 
    });
    
    res.status(200).send(healthData);
});

// Error handling middleware
app.use((err, req, res, next) => {
    logError('Unhandled error', err, {
        requestId: req.id,
        url: req.url,
        method: req.method
    });
    
    res.status(500).json({
        error: 'Internal Server Error',
        requestId: req.id,
        timestamp: new Date().toISOString()
    });
});

// 404 handler - catch all routes that haven't been matched
app.use((req, res, next) => {
    logger.warn('Route not found', {
        requestId: req.id,
        method: req.method,
        url: req.url
    });
    
    res.status(404).json({
        error: 'Not Found',
        requestId: req.id,
        timestamp: new Date().toISOString()
    });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    process.exit(0);
});

app.listen(PORT, () => {
    logger.info('Server started', {
        port: PORT,
        environment: NODE_ENV,
        service: SERVICE_NAME,
        version: SERVICE_VERSION,
        nodeVersion: process.version
    });
});