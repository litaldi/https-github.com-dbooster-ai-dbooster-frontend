
interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export class SEOOptimizer {
  private static instance: SEOOptimizer;

  static getInstance(): SEOOptimizer {
    if (!SEOOptimizer.instance) {
      SEOOptimizer.instance = new SEOOptimizer();
    }
    return SEOOptimizer.instance;
  }

  updatePageSEO(config: SEOConfig) {
    this.updateTitle(config.title);
    this.updateMetaDescription(config.description);
    this.updateOpenGraph(config);
    this.updateTwitterCard(config);
    
    if (config.keywords) {
      this.updateKeywords(config.keywords);
    }
    
    if (config.canonicalUrl) {
      this.updateCanonical(config.canonicalUrl);
    }

    this.updateStructuredData(config);
  }

  private updateTitle(title: string) {
    document.title = title;
    this.updateMetaProperty('og:title', title);
    this.updateMetaProperty('twitter:title', title);
  }

  private updateMetaDescription(description: string) {
    this.updateMetaTag('description', description);
    this.updateMetaProperty('og:description', description);
    this.updateMetaProperty('twitter:description', description);
  }

  private updateKeywords(keywords: string) {
    this.updateMetaTag('keywords', keywords);
  }

  private updateOpenGraph(config: SEOConfig) {
    this.updateMetaProperty('og:type', 'website');
    this.updateMetaProperty('og:url', window.location.href);
    this.updateMetaProperty('og:site_name', 'QueryMaster Pro');
    
    if (config.ogImage) {
      this.updateMetaProperty('og:image', config.ogImage);
      this.updateMetaProperty('og:image:width', '1200');
      this.updateMetaProperty('og:image:height', '630');
    }
  }

  private updateTwitterCard(config: SEOConfig) {
    this.updateMetaProperty('twitter:card', 'summary_large_image');
    this.updateMetaProperty('twitter:site', '@querymaster');
    
    if (config.ogImage) {
      this.updateMetaProperty('twitter:image', config.ogImage);
    }
  }

  private updateCanonical(url: string) {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }

  private updateStructuredData(config: SEOConfig) {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "QueryMaster Pro",
      "description": config.description,
      "url": window.location.origin,
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    };

    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
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

  private updateMetaProperty(property: string, content: string) {
    let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.property = property;
      document.head.appendChild(meta);
    }
    meta.content = content;
  }

  generateSitemap() {
    const routes = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/auth', priority: '0.8', changefreq: 'monthly' },
      { url: '/dashboard', priority: '0.9', changefreq: 'daily' },
      { url: '/profile', priority: '0.7', changefreq: 'weekly' }
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${window.location.origin}${route.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return sitemap;
  }
}

export const seoOptimizer = SEOOptimizer.getInstance();
