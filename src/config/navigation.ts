
import { LucideIcon } from 'lucide-react';

// Navigation types - Updated to be more flexible
export interface NavigationItem {
  title?: string;
  label?: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
  badge?: string;
  children?: NavigationItem[];
  items?: NavigationItem[];
}

// Navigation configuration for the application
export const megaMenuNavigation: NavigationItem[] = [
  {
    title: "Product",
    href: "/features",
    description: "Discover our powerful database optimization tools",
    items: [
      { title: "Features", href: "/features", description: "Core functionality and capabilities" },
      { title: "Pricing", href: "/pricing", description: "Plans for every team size" },
      { title: "Enterprise", href: "/enterprise", description: "Advanced solutions for large organizations" }
    ]
  },
  {
    title: "Solutions",
    href: "/solutions", 
    description: "Database optimization for every use case",
    items: [
      { title: "Performance Monitoring", href: "/solutions/monitoring", description: "Real-time database performance insights" },
      { title: "Query Optimization", href: "/solutions/optimization", description: "AI-powered query performance tuning" },
      { title: "Cost Reduction", href: "/solutions/cost-reduction", description: "Reduce infrastructure costs by up to 60%" }
    ]
  },
  {
    title: "Resources",
    href: "/resources",
    description: "Learn and get support",
    items: [
      { title: "Documentation", href: "/docs", description: "Complete guides and API reference" },
      { title: "Blog", href: "/blog", description: "Latest insights and best practices" },
      { title: "Case Studies", href: "/case-studies", description: "Success stories from our customers" },
      { title: "Support", href: "/support", description: "Get help when you need it" }
    ]
  },
  {
    title: "Company",
    href: "/about",
    description: "About DBooster",
    items: [
      { title: "About Us", href: "/about", description: "Our mission and team" },
      { title: "Careers", href: "/careers", description: "Join our growing team" },
      { title: "Contact", href: "/contact", description: "Get in touch with us" }
    ]
  }
];

// User menu navigation
export const userMenuNavigation: NavigationItem[] = [
  { title: "Dashboard", href: "/app", label: "Dashboard" },
  { title: "Settings", href: "/settings", label: "Settings" },
  { title: "Support", href: "/support", label: "Support" },
  { title: "Sign Out", href: "/logout", label: "Sign Out" }
];

// Main navigation items
export const mainNavigation: NavigationItem[] = [
  { title: "Features", href: "/features", label: "Features" },
  { title: "Pricing", href: "/pricing", label: "Pricing" },
  { title: "Resources", href: "/resources", label: "Resources" },
  { title: "About", href: "/about", label: "About" }
];

// Footer navigation structure
export const footerNavigation = {
  product: [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/enterprise", label: "Enterprise" },
    { href: "/integrations", label: "Integrations" }
  ],
  solutions: [
    { href: "/solutions/monitoring", label: "Performance Monitoring" },
    { href: "/solutions/optimization", label: "Query Optimization" },
    { href: "/solutions/cost-reduction", label: "Cost Reduction" },
    { href: "/solutions/security", label: "Security & Compliance" }
  ],
  resources: [
    { href: "/docs", label: "Documentation" },
    { href: "/blog", label: "Blog" },
    { href: "/case-studies", label: "Case Studies" },
    { href: "/support", label: "Support" },
    { href: "/community", label: "Community" }
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
    { href: "/press", label: "Press" }
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/cookies", label: "Cookie Policy" }
  ]
};

// Social proof indicators
export const socialProofIndicators = {
  customerCount: "10,000+",
  queryOptimizations: "2.5M+",
  averageImprovement: "73%",
  costSavings: "60%",
  certifications: ["SOC 2", "ISO 27001", "GDPR"]
};

// Contact information
export const contactInfo = {
  email: "hello@dbooster.ai",
  phone: "+1 (555) 123-4567",
  address: "123 Innovation Drive, San Francisco, CA 94105",
  social: {
    twitter: "https://twitter.com/dbooster",
    linkedin: "https://linkedin.com/company/dbooster",
    github: "https://github.com/dbooster"
  }
};
