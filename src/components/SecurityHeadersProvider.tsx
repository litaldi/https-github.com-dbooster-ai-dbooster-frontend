import React, { useEffect } from 'react';

interface SecurityHeadersProviderProps {
  children: React.ReactNode;
}

export const SecurityHeadersProvider: React.FC<SecurityHeadersProviderProps> = ({ children }) => {
  useEffect(() => {
    // Generate nonce for inline scripts
    const nonce = generateNonce();
    
    // Apply enhanced Content Security Policy
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://sxcbpmqsbcpsljwwwwyv.supabase.co wss://sxcbpmqsbcpsljwwwwyv.supabase.co",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
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
      { name: 'Permissions-Policy', content: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=()' },
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
    reportingMeta.content = `${csp}; report-uri /api/security/csp-violation`;
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
      
      // Report to security endpoint
      fetch('/api/security/xss-detection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pattern: pattern.source,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      }).catch(err => console.error('Failed to report XSS detection:', err));
    }
  });
}