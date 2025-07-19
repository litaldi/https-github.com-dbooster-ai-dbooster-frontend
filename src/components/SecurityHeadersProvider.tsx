
import { useEffect } from 'react';

interface SecurityHeadersProviderProps {
  children: React.ReactNode;
}

export function SecurityHeadersProvider({ children }: SecurityHeadersProviderProps) {
  useEffect(() => {
    // Enhanced Content Security Policy
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.ipify.org",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; ');

    // Remove existing security headers to avoid duplicates
    const existingHeaders = document.querySelectorAll('meta[http-equiv*="Content-Security-Policy"], meta[http-equiv*="X-"], meta[http-equiv*="Referrer-Policy"], meta[http-equiv*="Permissions-Policy"]');
    existingHeaders.forEach(header => header.remove());

    // Apply enhanced security headers
    const securityHeaders = [
      { httpEquiv: 'Content-Security-Policy', content: csp },
      { httpEquiv: 'X-Content-Type-Options', content: 'nosniff' },
      { httpEquiv: 'X-Frame-Options', content: 'DENY' },
      { httpEquiv: 'X-XSS-Protection', content: '1; mode=block' },
      { httpEquiv: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
      { httpEquiv: 'Permissions-Policy', content: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()' },
      { httpEquiv: 'Strict-Transport-Security', content: 'max-age=31536000; includeSubDomains; preload' }
    ];

    securityHeaders.forEach(({ httpEquiv, content }) => {
      const meta = document.createElement('meta');
      meta.httpEquiv = httpEquiv;
      meta.content = content;
      document.head.appendChild(meta);
    });

    // Add security.txt meta tag
    const securityTxt = document.createElement('meta');
    securityTxt.name = 'security';
    securityTxt.content = 'Contact security@example.com for security issues';
    document.head.appendChild(securityTxt);

  }, []);

  // Security event monitoring
  useEffect(() => {
    const handleSecurityViolation = (event: SecurityPolicyViolationEvent) => {
      console.warn('Security Policy Violation:', {
        blockedURI: event.blockedURI,
        documentURI: event.documentURI,
        effectiveDirective: event.effectiveDirective,
        violatedDirective: event.violatedDirective
      });

      // Log to security system
      import('@/utils/productionLogger').then(({ productionLogger }) => {
        productionLogger.warn('CSP Violation', {
          blockedURI: event.blockedURI,
          violatedDirective: event.violatedDirective
        }, 'SecurityHeaders');
      });
    };

    document.addEventListener('securitypolicyviolation', handleSecurityViolation);
    
    return () => {
      document.removeEventListener('securitypolicyviolation', handleSecurityViolation);
    };
  }, []);

  return <>{children}</>;
}
