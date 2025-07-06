
interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogImage?: string;
}

class SEOOptimizer {
  updatePageSEO(config: SEOConfig) {
    // Update document title
    document.title = config.title;
    
    // Update meta description
    this.updateMeta('description', config.description);
    
    // Update meta keywords
    this.updateMeta('keywords', config.keywords);
    
    // Update canonical URL
    this.updateLink('canonical', config.canonicalUrl);
    
    // Update Open Graph tags
    this.updateMeta('og:title', config.title, 'property');
    this.updateMeta('og:description', config.description, 'property');
    this.updateMeta('og:url', config.canonicalUrl, 'property');
    this.updateMeta('og:type', 'website', 'property');
    
    if (config.ogImage) {
      this.updateMeta('og:image', config.ogImage, 'property');
    }
    
    // Update Twitter Card tags
    this.updateMeta('twitter:card', 'summary_large_image');
    this.updateMeta('twitter:title', config.title);
    this.updateMeta('twitter:description', config.description);
  }
  
  private updateMeta(name: string, content: string, attribute: string = 'name') {
    let meta = document.querySelector(`meta[${attribute}="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }
  
  private updateLink(rel: string, href: string) {
    let link = document.querySelector(`link[rel="${rel}"]`);
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', rel);
      document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }
}

export const seoOptimizer = new SEOOptimizer();
