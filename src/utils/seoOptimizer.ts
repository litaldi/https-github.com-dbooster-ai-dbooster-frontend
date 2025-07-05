
interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl?: string;
}

class SEOOptimizer {
  updatePageSEO(config: SEOConfig) {
    // Update document title
    document.title = config.title;
    
    // Update meta description
    this.updateMetaTag('description', config.description);
    
    // Update meta keywords
    this.updateMetaTag('keywords', config.keywords);
    
    // Update canonical URL
    if (config.canonicalUrl) {
      this.updateCanonicalUrl(config.canonicalUrl);
    }
  }

  updateStructuredData(data: object) {
    // Remove existing structured data
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());
    
    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  private updateMetaTag(name: string, content: string) {
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = content;
  }

  private updateCanonicalUrl(url: string) {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;
  }
}

export const seoOptimizer = new SEOOptimizer();
