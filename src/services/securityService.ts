
// Unified Security Service - Single point of entry for all security operations
export { unifiedSecurityService as securityService } from './security/unified/UnifiedSecurityService';

// Legacy exports for backward compatibility - these will be deprecated
export { auditLogger } from './auditLogger';
export { rateLimitService } from './security/rateLimitService';
export { threatDetectionService } from './threatDetectionService';

// Re-export essential types
export type { AuthFormData, AuthMode, LoginType } from '@/types/auth';
