
// Consolidated utility exports
export { logger } from './logger';
export { productionManager } from './productionManager';
export { performanceTracker } from './performanceTracker';
export { ErrorRecovery, setupGlobalErrorHandling } from './errorRecovery';
export { getErrorMessage, sanitizeErrorMessage, AppError, handleAuthError } from './errorHandling';

// Re-export commonly used utilities
export { cn } from '@/lib/utils';
