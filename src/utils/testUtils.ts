/**
 * Test utilities for security testing and mocking
 */

import { vi } from 'vitest';

export const mockSecurityData = {
  auditReport: {
    totalEvents: 150,
    threatsDetected: 7,
    blockedIPs: 3,
    suspiciousPatterns: [
      'Multiple failed login attempts',
      'Suspicious SQL patterns detected',
      'Rate limit exceeded'
    ],
    recentHighRiskEvents: [
      {
        id: 'evt_001',
        event_type: 'suspicious_login',
        ip_address: '192.168.1.100',
        created_at: '2024-01-15T10:30:00Z',
        risk_score: 85
      },
      {
        id: 'evt_002',
        event_type: 'sql_injection_attempt',
        ip_address: '10.0.0.50',
        created_at: '2024-01-15T10:25:00Z',
        risk_score: 95
      }
    ]
  },

  performanceMetrics: {
    averageResponseTime: 142,
    requestsPerMinute: 67,
    validationLatency: 23,
    memoryUsage: 0.65,
    cacheHitRate: 0.78
  },

  patternUpdateHistory: [
    {
      timestamp: '2024-01-15T09:00:00Z',
      patterns: ['sql_injection', 'xss', 'csrf'],
      updateSource: 'automatic',
      patternsAdded: 5,
      patternsUpdated: 12
    },
    {
      timestamp: '2024-01-14T09:00:00Z',
      patterns: ['command_injection', 'path_traversal'],
      updateSource: 'manual',
      patternsAdded: 2,
      patternsUpdated: 3
    }
  ],

  securityAlerts: [
    {
      id: 'alert_001',
      type: 'high_risk_event',
      severity: 'critical',
      message: 'Multiple SQL injection attempts detected',
      timestamp: '2024-01-15T10:30:00Z',
      resolved: false
    },
    {
      id: 'alert_002',
      type: 'rate_limit_exceeded',
      severity: 'warning',
      message: 'Rate limit exceeded for IP 192.168.1.100',
      timestamp: '2024-01-15T10:20:00Z',
      resolved: true
    }
  ]
};

export const mockSecurityEvents = [
  {
    id: 'se_001',
    event_type: 'login_attempt',
    user_id: 'user_123',
    ip_address: '192.168.1.1',
    user_agent: 'Mozilla/5.0...',
    event_data: {
      success: true,
      method: 'email_password'
    },
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'se_002',
    event_type: 'threat_detected',
    user_id: null,
    ip_address: '10.0.0.1',
    user_agent: 'BadBot/1.0',
    event_data: {
      threatType: 'sql_injection',
      input: "'; DROP TABLE users; --",
      riskScore: 95
    },
    created_at: '2024-01-15T10:05:00Z'
  }
];

export const createMockSecurityService = () => ({
  validateUserInput: vi.fn().mockResolvedValue({
    valid: true,
    sanitized: 'clean input',
    threats: [],
    riskLevel: 'low'
  }),

  validateFormData: vi.fn().mockResolvedValue({
    valid: true,
    errors: {},
    sanitized: {}
  }),

  checkRateLimit: vi.fn().mockResolvedValue({
    allowed: true,
    retryAfter: null
  }),

  logSecurityEvent: vi.fn().mockResolvedValue(undefined),

  getSecurityDashboard: vi.fn().mockResolvedValue({
    userId: 'user_123',
    securityLevel: 'high',
    activeThreats: 2,
    timestamp: new Date()
  }),

  detectSuspiciousActivity: vi.fn().mockResolvedValue({
    suspicious: false,
    riskLevel: 'low',
    patterns: []
  })
});

export const createMockThreatDetection = () => ({
  detectThreats: vi.fn().mockResolvedValue({
    isThreat: false,
    threatType: null,
    confidence: 0.1,
    patterns: []
  }),

  analyzeBehaviorPatterns: vi.fn().mockResolvedValue([]),

  updateThreatPatterns: vi.fn().mockResolvedValue(true)
});

export const securityTestHelpers = {
  /**
   * Creates a mock security context for testing
   */
  createSecurityContext: (overrides = {}) => ({
    isInitialized: true,
    isProcessing: false,
    error: null,
    ...overrides
  }),

  /**
   * Generates test data for security events
   */
  generateSecurityEvent: (overrides = {}) => ({
    id: `event_${Math.random().toString(36).substr(2, 9)}`,
    event_type: 'test_event',
    user_id: 'test_user',
    ip_address: '127.0.0.1',
    created_at: new Date().toISOString(),
    event_data: {},
    ...overrides
  }),

  /**
   * Creates a mock validation result
   */
  createValidationResult: (isValid = true, overrides = {}) => ({
    isValid,
    errors: isValid ? [] : ['Test validation error'],
    warnings: [],
    riskLevel: isValid ? 'low' : 'medium',
    sanitizedValue: 'sanitized test value',
    ...overrides
  }),

  /**
   * Waits for async operations to complete
   */
  waitForAsync: () => new Promise(resolve => setTimeout(resolve, 0)),

  /**
   * Creates a mock session for testing
   */
  createMockSession: (overrides = {}) => ({
    session_id: 'test_session_123',
    user_id: 'test_user_123',
    ip_address: '127.0.0.1',
    device_fingerprint: 'test_fingerprint',
    security_score: 85,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    ...overrides
  })
};
