
class ResourcePreloader {
  private static preloadedResources: Set<string> = new Set();

  static preloadCriticalAssets() {
    // Preload critical CSS
    this.preloadResource('/fonts/inter.woff2', 'font', 'font/woff2');
    
    // Preload critical images
    const criticalImages = [
      '/hero-bg.webp',
      '/logo.svg'
    ];
    
    criticalImages.forEach(src => {
      this.preloadResource(src, 'image');
    });
  }

  static preloadResource(href: string, as: string, type?: string) {
    if (this.preloadedResources.has(href)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    
    document.head.appendChild(link);
    this.preloadedResources.add(href);
  }

  static getPreloadedResources(): string[] {
    return Array.from(this.preloadedResources);
  }
}

export { ResourcePreloader };
