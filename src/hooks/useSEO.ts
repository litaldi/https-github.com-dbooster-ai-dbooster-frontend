
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { seoOptimizer } from '@/utils/seoOptimizer';

interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl?: string;
}

const pageSEOConfig: Record<string, SEOConfig> = {
  '/': {
    title: 'DBooster - AI-Powered Database Optimization Platform',
    description: 'Transform slow queries into lightning-fast operations with DBooster\'s AI-powered database optimization. Improve performance by up to 73% with enterprise-grade security.',
    keywords: 'database optimization, SQL performance, AI database tools, query optimization, database performance monitoring, enterprise database solutions'
  },
  '/features': {
    title: 'Features - Advanced Database Optimization Tools | DBooster',
    description: 'Explore DBooster\'s comprehensive suite of AI-powered database optimization features including real-time monitoring, query analysis, and performance insights.',
    keywords: 'database features, SQL optimization tools, performance monitoring, query analysis, database security, team collaboration'
  },
  '/pricing': {
    title: 'Pricing - Affordable Database Optimization Plans | DBooster',
    description: 'Choose the perfect DBooster plan for your team. From individual developers to enterprise organizations, we have database optimization solutions that fit your needs.',
    keywords: 'database optimization pricing, SQL tools pricing, database performance plans, enterprise database solutions'
  },
  '/about': {
    title: 'About Us - Database Optimization Experts | DBooster',
    description: 'Learn about DBooster\'s mission to revolutionize database performance through AI-powered optimization tools trusted by thousands of developers worldwide.',
    keywords: 'database optimization company, SQL performance experts, database consulting, AI database tools'
  }
};

export function useSEO(customConfig?: Partial<SEOConfig>) {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;
    const defaultConfig = pageSEOConfig[pathname] || pageSEOConfig['/'];
    
    const config = {
      ...defaultConfig,
      ...customConfig,
      canonicalUrl: `https://dbooster.app${pathname}`
    };

    seoOptimizer.updatePageSEO(config);

    // Update structured data for different page types
    if (pathname === '/') {
      const organizationData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "DBooster",
        "description": config.description,
        "url": "https://dbooster.app",
        "logo": "https://dbooster.app/logo.png",
        "sameAs": [
          "https://twitter.com/dbooster",
          "https://linkedin.com/company/dbooster"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+1-800-DBOOSTER",
          "contactType": "customer service"
        }
      };
      
      seoOptimizer.updateStructuredData(organizationData);
    }

    // Analytics page view tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: config.title,
        page_location: config.canonicalUrl
      });
    }
  }, [location.pathname, customConfig]);
}
