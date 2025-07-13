
import { productionLogger } from './productionLogger';

// Clean logger that replaces console.* statements throughout the app
export const cleanLogger = {
  info: (message: string, metadata?: Record<string, any>, context?: string) => {
    productionLogger.info(message, metadata, context);
  },
  
  warn: (message: string, error?: any, context?: string, metadata?: Record<string, any>) => {
    productionLogger.warn(message, error, context, metadata);
  },
  
  error: (message: string, error?: any, context?: string, metadata?: Record<string, any>) => {
    productionLogger.error(message, error, context, metadata);
  },
  
  debug: (message: string, metadata?: Record<string, any>, context?: string) => {
    productionLogger.debug(message, metadata, context);
  },

  // Secure versions for sensitive data
  secureInfo: (message: string, metadata?: Record<string, any>, context?: string) => {
    productionLogger.secureInfo(message, metadata, context);
  },

  secureDebug: (message: string, metadata?: Record<string, any>, context?: string) => {
    productionLogger.secureDebug(message, metadata, context);
  }
};
