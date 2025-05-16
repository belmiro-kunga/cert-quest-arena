import { logger } from '../utils/logger';
import { db } from '../lib/db/config';
import os from 'os';
import { EventEmitter } from 'events';

export class MonitoringService extends EventEmitter {
  private static instance: MonitoringService;
  private metrics: Map<string, any>;
  private alerts: Map<string, any>;
  private checkInterval: NodeJS.Timeout | null;

  private constructor() {
    super();
    this.metrics = new Map();
    this.alerts = new Map();
    this.checkInterval = null;
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  // Inicia o monitoramento
  public startMonitoring(interval: number = 60000): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(() => {
      this.checkSystemHealth();
      this.checkDatabaseHealth();
      this.checkSecurityMetrics();
    }, interval);

    logger.info('Monitoring service started');
  }

  // Para o monitoramento
  public stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    logger.info('Monitoring service stopped');
  }

  // Verifica saúde do sistema
  private async checkSystemHealth(): Promise<void> {
    try {
      const metrics = {
        cpu: os.loadavg()[0],
        memory: {
          total: os.totalmem(),
          free: os.freemem(),
          used: os.totalmem() - os.freemem()
        },
        uptime: os.uptime()
      };

      this.metrics.set('system', metrics);
      this.emit('systemMetrics', metrics);

      // Alerta se CPU > 80% ou memória > 90%
      if (metrics.cpu > 0.8) {
        this.triggerAlert('high_cpu', { cpu: metrics.cpu });
      }

      const memoryUsage = metrics.memory.used / metrics.memory.total;
      if (memoryUsage > 0.9) {
        this.triggerAlert('high_memory', { usage: memoryUsage });
      }
    } catch (error) {
      logger.error('System health check failed:', error);
    }
  }

  // Verifica saúde do banco de dados
  private async checkDatabaseHealth(): Promise<void> {
    try {
      const startTime = Date.now();
      const isConnected = await db.checkConnection();
      const responseTime = Date.now() - startTime;

      const metrics = {
        connected: isConnected,
        responseTime,
        timestamp: new Date().toISOString()
      };

      this.metrics.set('database', metrics);
      this.emit('databaseMetrics', metrics);

      if (!isConnected) {
        this.triggerAlert('database_disconnected', metrics);
      }

      if (responseTime > 1000) { // Mais de 1 segundo
        this.triggerAlert('slow_database', metrics);
      }
    } catch (error) {
      logger.error('Database health check failed:', error);
      this.triggerAlert('database_error', { error: error.message });
    }
  }

  // Verifica métricas de segurança
  private async checkSecurityMetrics(): Promise<void> {
    try {
      const metrics = {
        failedLogins: this.getFailedLogins(),
        suspiciousActivities: this.getSuspiciousActivities(),
        timestamp: new Date().toISOString()
      };

      this.metrics.set('security', metrics);
      this.emit('securityMetrics', metrics);

      if (metrics.failedLogins > 5) {
        this.triggerAlert('multiple_failed_logins', metrics);
      }

      if (metrics.suspiciousActivities > 0) {
        this.triggerAlert('suspicious_activity', metrics);
      }
    } catch (error) {
      logger.error('Security metrics check failed:', error);
    }
  }

  // Obtém métricas atuais
  public getMetrics(): Map<string, any> {
    return new Map(this.metrics);
  }

  // Obtém alertas ativos
  public getAlerts(): Map<string, any> {
    return new Map(this.alerts);
  }

  // Dispara um alerta
  private triggerAlert(type: string, data: any): void {
    const alert = {
      type,
      data,
      timestamp: new Date().toISOString()
    };

    this.alerts.set(type, alert);
    this.emit('alert', alert);
    logger.warn('Security alert triggered', alert);
  }

  // Obtém número de logins falhos
  private getFailedLogins(): number {
    // Implementar lógica para contar logins falhos
    return 0;
  }

  // Obtém número de atividades suspeitas
  private getSuspiciousActivities(): number {
    // Implementar lógica para contar atividades suspeitas
    return 0;
  }

  // Registra uma atividade suspeita
  public logSuspiciousActivity(activity: any): void {
    logger.warn('Suspicious activity detected', activity);
    this.emit('suspiciousActivity', activity);
  }

  // Registra uma tentativa de login
  public logLoginAttempt(userId: string, success: boolean, details: any = {}): void {
    const attempt = {
      userId,
      success,
      timestamp: new Date().toISOString(),
      ...details
    };

    logger.info('Login attempt', attempt);
    this.emit('loginAttempt', attempt);

    if (!success) {
      this.triggerAlert('failed_login', attempt);
    }
  }
} 