
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
  context?: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private createLogEntry(level: LogLevel, message: string, data?: unknown, context?: string): LogEntry {
    return {
      level,
      message,
      data,
      context,
      timestamp: new Date().toISOString(),
    };
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  debug(message: string, data?: unknown, context?: string): void {
    const entry = this.createLogEntry('debug', message, data, context);
    this.addLog(entry);
    
    if (this.isDevelopment) {
      console.debug(`[DEBUG]${context ? ` [${context}]` : ''} ${message}`, data || '');
    }
  }

  info(message: string, data?: unknown, context?: string): void {
    const entry = this.createLogEntry('info', message, data, context);
    this.addLog(entry);
    
    if (this.isDevelopment) {
      console.info(`[INFO]${context ? ` [${context}]` : ''} ${message}`, data || '');
    }
  }

  warn(message: string, data?: unknown, context?: string): void {
    const entry = this.createLogEntry('warn', message, data, context);
    this.addLog(entry);
    
    console.warn(`[WARN]${context ? ` [${context}]` : ''} ${message}`, data || '');
  }

  error(message: string, error?: unknown, context?: string): void {
    const entry = this.createLogEntry('error', message, error, context);
    this.addLog(entry);
    
    console.error(`[ERROR]${context ? ` [${context}]` : ''} ${message}`, error || '');
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (!level) return [...this.logs];
    return this.logs.filter(log => log.level === level);
  }

  clearLogs(): void {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();
