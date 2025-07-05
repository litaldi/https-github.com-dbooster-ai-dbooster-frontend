
interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
}

class SEOOptimizer {
  private static instance: SEOOptimizer;

  static getInstance(): SEOOptimizer {
    if (!SEOOptimizer.instance) {
      SEOOptimizer.instance = new SEOOptimizer();
    }
    return SEOOptimizer.instance;
  }

  updatePageSEO(config: SEOConfig) {
    if (typeof document === 'undefined') return;

    // Update title
    document.title = config.title;

    // Update or create meta description
    this.updateMetaTag('description', config.description);

    // Update or create meta keywords
    this.updateMetaTag('keywords', config.keywords);

    // Update or create canonical URL
    this.updateCanonicalUrl(config.canonicalUrl);

    // Update Open Graph tags
    this.updateMetaTag('og:title', config.title, 'property');
    this.updateMetaTag('og:description', config.description, 'property');
    this.updateMetaTag('og:url', config.canonicalUrl, 'property');
  }

  private updateMetaTag(name: string, content: string, attribute: string = 'name') {
    let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
    
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, name);
      document.head.appendChild(meta);
    }
    
    meta.content = content;
  }

  private updateCanonicalUrl(url: string) {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    
    canonical.href = url;
  }
}

export const seoOptimizer = SEOOptimizer.getInstance();
