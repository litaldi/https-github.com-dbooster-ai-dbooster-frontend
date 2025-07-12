
// Re-export essential security services for backward compatibility
export { auditLogger } from '../auditLogger';
export { rateLimitService } from './rateLimitService';
export { threatDetectionService } from '../threatDetectionService';
export { consolidatedAuthenticationSecurity } from './consolidatedAuthenticationSecurity';
export { consolidatedInputValidation } from './consolidatedInputValidation';
export { enhancedThreatDetection } from './threatDetectionEnhanced';
export { rbac } from './roleBasedAccessControl';
export { apiSecurity } from './apiSecurityEnhancement';
export { securityDashboard } from './securityDashboardService';
