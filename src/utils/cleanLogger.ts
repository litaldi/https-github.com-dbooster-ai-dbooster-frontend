
import { productionLogger } from './productionLogger';

// Simple wrapper around productionLogger for backward compatibility
export const cleanLogger = {
  info: (message: string, data?: any, component?: string) => {
    productionLogger.info(message, data, component);
  },
  
  error: (message: string, error: any, component?: string) => {
    productionLogger.error(message, error, component);
  },
  
  warn: (message: string, data?: any, component?: string) => {
    productionLogger.warn(message, data, component);
  },
  
  debug: (message: string, data?: any, component?: string) => {
    productionLogger.debug(message, data, component);
  }
};
