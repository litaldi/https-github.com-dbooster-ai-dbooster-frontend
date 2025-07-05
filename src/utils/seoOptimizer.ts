
interface SEOOptions {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
}

class SEOOptimizer {
  updatePageSEO({ title, description, keywords, canonicalUrl }: SEOOptions) {
    // Update title
    if (title) {
      document.title = title;
    }

    // Update meta description
    this.updateMetaTag('description', description);

    // Update meta keywords
    if (keywords) {
      this.updateMetaTag('keywords', keywords);
    }

    // Update canonical URL
    if (canonicalUrl) {
      this.updateCanonical(canonicalUrl);
    }
  }

  private updateMetaTag(name: string, content: string) {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }

  private updateCanonical(url: string) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }
}

export const seoOptimizer = new SEOOptimizer();
