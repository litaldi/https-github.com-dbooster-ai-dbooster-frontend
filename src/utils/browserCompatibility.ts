
// Browser compatibility and feature detection utilities
export class BrowserCompatibility {
  static detectBrowser(): string {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edg')) return 'Edge';
    return 'Unknown';
  }

  static detectDevice(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  static checkFeatureSupport() {
    return {
      webVitals: 'web-vitals' in window,
      localStorage: typeof Storage !== 'undefined',
      sessionStorage: typeof sessionStorage !== 'undefined',
      fetch: typeof fetch !== 'undefined',
      es6: typeof Symbol !== 'undefined',
      css: {
        grid: CSS.supports('display', 'grid'),
        flexbox: CSS.supports('display', 'flex'),
        customProperties: CSS.supports('--test', 'test')
      }
    };
  }

  static logCompatibilityInfo() {
    const info = {
      browser: this.detectBrowser(),
      device: this.detectDevice(),
      features: this.checkFeatureSupport(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      userAgent: navigator.userAgent
    };
    
    console.log('Browser Compatibility Info:', info);
    return info;
  }
}
