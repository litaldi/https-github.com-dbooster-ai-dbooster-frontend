import React, { useEffect } from 'react';

interface SecurityHeadersProviderProps {
  children: React.ReactNode;
}

export const SecurityHeadersProvider: React.FC<SecurityHeadersProviderProps> = ({ children }) => {
  useEffect(() => {
    // Initialize enhanced CSP violation handler
    import('@/services/security/enhancedCSPViolationHandler').then(({ enhancedCSPViolationHandler }) => {
      enhancedCSPViolationHandler.setupEnhancedCSPMonitoring();
    });

    // Generate nonce for inline scripts
    const nonce = generateNonce();
    
    // Apply enhanced Content Security Policy with nonce-based security
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`, // Removed unsafe-inline
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // Keep unsafe-inline for styles temporarily
      "img-src 'self' data: https: blob:",
      "font-src 'self' https://fonts.gstatic.com data:",
      "connect-src 'self' https://sxcbpmqsbcpsljwwwwyv.supabase.co wss://sxcbpmqsbcpsljwwwwyv.supabase.co",
      "object-src 'none'",
      "media-src 'self'",
      "worker-src 'self'",
      "manifest-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
      "block-all-mixed-content"
    ].join('; ');

    // Remove existing security headers to avoid duplicates
    removeExistingSecurityHeaders();

    // Apply security headers
    const securityHeaders = [
      { name: 'Content-Security-Policy', content: csp },
      { name: 'X-Content-Type-Options', content: 'nosniff' },
      { name: 'X-Frame-Options', content: 'DENY' },
      { name: 'X-XSS-Protection', content: '1; mode=block' },
      { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
      { name: 'Permissions-Policy', content: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), serial=()' },
      { name: 'Strict-Transport-Security', content: 'max-age=31536000; includeSubDomains; preload' },
      { name: 'X-Permitted-Cross-Domain-Policies', content: 'none' },
      { name: 'X-DNS-Prefetch-Control', content: 'off' },
      { name: 'Cross-Origin-Embedder-Policy', content: 'require-corp' },
      { name: 'Cross-Origin-Opener-Policy', content: 'same-origin' },
      { name: 'Cross-Origin-Resource-Policy', content: 'same-origin' }
    ];

    securityHeaders.forEach(({ name, content }) => {
      const meta = document.createElement('meta');
      meta.httpEquiv = name;
      meta.content = content;
      meta.setAttribute('data-security-header', 'true');
      document.head.appendChild(meta);
    });

    // Add security reporting endpoint
    const reportingMeta = document.createElement('meta');
    reportingMeta.httpEquiv = 'Content-Security-Policy-Report-Only';
    reportingMeta.content = `${csp}; report-uri https://sxcbpmqsbcpsljwwwwyv.supabase.co/functions/v1/csp-violation-report`;
    reportingMeta.setAttribute('data-security-header', 'true');
    document.head.appendChild(reportingMeta);

    // Set up periodic security validation
    const securityInterval = setInterval(() => {
      validateSecurityHeaders();
      checkForSecurityThreats();
    }, 30000); // Check every 30 seconds

    // Cleanup function
    return () => {
      clearInterval(securityInterval);
    };
  }, []);

  return <>{children}</>;
};

function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

function removeExistingSecurityHeaders() {
  const existingHeaders = document.querySelectorAll('meta[data-security-header="true"]');
  existingHeaders.forEach(header => header.remove());
}

function validateSecurityHeaders() {
  const requiredHeaders = [
    'Content-Security-Policy',
    'X-Content-Type-Options',
    'X-Frame-Options',
    'X-XSS-Protection'
  ];

  const missingHeaders = requiredHeaders.filter(headerName => {
    return !document.querySelector(`meta[http-equiv="${headerName}"]`);
  });

  if (missingHeaders.length > 0) {
    console.warn('Security headers validation failed. Missing headers:', missingHeaders);
    
    // Report security header validation failure
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SECURITY_HEADER_VALIDATION_FAILED',
        missingHeaders
      });
    }
  }
}

function checkForSecurityThreats() {
  // Check for suspicious DOM modifications
  const suspiciousElements = document.querySelectorAll('script[src]:not([src^="https://"])');
  if (suspiciousElements.length > 0) {
    console.warn('Suspicious script elements detected:', suspiciousElements);
  }

  // Check for inline event handlers
  const elementsWithInlineEvents = document.querySelectorAll('*[onclick], *[onload], *[onerror]');
  if (elementsWithInlineEvents.length > 0) {
    console.warn('Inline event handlers detected:', elementsWithInlineEvents);
  }

  // Monitor for XSS attempts
  const potentialXSSPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi
  ];

  const bodyText = document.body.innerHTML;
  potentialXSSPatterns.forEach(pattern => {
    if (pattern.test(bodyText)) {
      console.error('Potential XSS pattern detected');
      
      // Report to security endpoint via Supabase function
      fetch('https://sxcbpmqsbcpsljwwwwyv.supabase.co/functions/v1/csp-violation-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'csp-report': {
            'blocked-uri': 'xss-pattern-detected',
            'document-uri': window.location.href,
            'violated-directive': 'xss-protection',
            'original-policy': pattern.source
          }
        })
      }).catch(err => console.error('Failed to report XSS detection:', err));
    }
  });
}