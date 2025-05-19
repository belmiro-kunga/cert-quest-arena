// Browser-compatible logger for frontend
const isBrowser = typeof window !== 'undefined';

// Simple browser logger
const browserLogger = {
  info: (message: string, ...args: any[]) => {
    console.info(`[INFO] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  debug: (message: string, ...args: any[]) => {
    console.debug(`[DEBUG] ${message}`, ...args);
  },
  // Add a no-op add method for browser logger
  add: () => {}
};

// Define logger type
type Logger = {
  info: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
  debug: (message: string, ...args: any[]) => void;
  add: (transport: any) => void;
};

// Create server logger
let serverLogger: Logger | null = null;

// Export the appropriate logger based on environment
export const logger: Logger = isBrowser ? browserLogger : (() => {
  if (!serverLogger) {
    // Only import winston in Node.js environment
    import('winston').then((winston) => {
      serverLogger = winston.default.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: winston.default.format.combine(
          winston.default.format.timestamp(),
          winston.default.format.json()
        ),
        defaultMeta: { service: 'cert-quest-arena' },
        transports: [
          new winston.default.transports.File({ 
            filename: 'logs/error.log', 
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
          }),
          new winston.default.transports.File({ 
            filename: 'logs/combined.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
          }),
        ],
      });

      // Add console transport in development
      if (process.env.NODE_ENV !== 'production') {
        serverLogger.add(new winston.default.transports.Console({
          format: winston.default.format.combine(
            winston.default.format.colorize(),
            winston.default.format.simple()
          ),
        }));
      }
    }).catch((error) => {
      console.error('Failed to initialize Winston logger:', error);
      serverLogger = browserLogger; // Fallback to browser logger
    });
  }
  return serverLogger || browserLogger;
})();

// Middleware para logging de requisições
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('user-agent'),
      ip: req.ip,
    });
  });
  
  next();
};

// Função para logging de erros
export const errorLogger = (error: Error, req: any) => {
  logger.error('Error occurred', {
    error: {
      message: error.message,
      stack: error.stack,
    },
    request: {
      method: req.method,
      url: req.url,
      body: req.body,
      user: req.user?.id,
    },
  });
};

// Export security logging functions
export const securityLogger = {
  login: (userId: string, success: boolean, details: any = {}) => {
    logger.info('Login attempt', {
      userId,
      success,
      ...details,
    });
  },
  
  passwordChange: (userId: string, success: boolean) => {
    logger.info('Password change attempt', {
      userId,
      success,
    });
  },
  
  permissionChange: (userId: string, targetUserId: string, changes: any) => {
    logger.info('Permission change', {
      userId,
      targetUserId,
      changes,
    });
  },
  
  dataAccess: (userId: string, resource: string, action: string) => {
    logger.info('Data access', {
      userId,
      resource,
      action,
    });
  },
}; 