import winston from 'winston';

// Configuração do logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'cert-quest-arena' },
  transports: [
    // Log para arquivo
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Adiciona console transport em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

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

// Função para logging de operações sensíveis
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

export { logger }; 