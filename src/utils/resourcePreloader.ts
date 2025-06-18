
// Advanced resource preloading for critical assets
export class ResourcePreloader {
  private static preloadedResources = new Set<string>();

  static preloadCriticalAssets() {
    // Preload critical fonts
    this.preloadFont('/fonts/inter-var.woff2');
    
    // Preload hero images with different formats
    this.preloadImage('/images/hero-bg.webp', 'image/webp');
    this.preloadImage('/images/hero-bg.jpg', 'image/jpeg'); // fallback
    
    // Preload critical CSS
    this.preloadCSS('/src/index.css');

    console.log('🚀 Critical assets preloaded');
  }

  static preloadFont(href: string) {
    if (this.preloadedResources.has(href)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
    
    this.preloadedResources.add(href);
  }

  static preloadImage(href: string, type?: string) {
    if (this.preloadedResources.has(href)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = 'image';
    if (type) link.type = type;
    document.head.appendChild(link);
    
    this.preloadedResources.add(href);
  }

  static preloadCSS(href: string) {
    if (this.preloadedResources.has(href)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = 'style';
    document.head.appendChild(link);
    
    this.preloadedResources.add(href);
  }

  static preloadScript(href: string) {
    if (this.preloadedResources.has(href)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = 'script';
    document.head.appendChild(link);
    
    this.preloadedResources.add(href);
  }

  static prefetchRoute(href: string) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }

  static getPreloadedResources() {
    return Array.from(this.preloadedResources);
  }
}
