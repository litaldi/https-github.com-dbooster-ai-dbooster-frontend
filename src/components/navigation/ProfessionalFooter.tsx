
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Github,
  Shield,
  CheckCircle2,
  ArrowRight,
  Globe,
  Heart
} from 'lucide-react';

export function ProfessionalFooter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const productLinks = [
    { href: '/features', label: 'Features & Capabilities' },
    { href: '/pricing', label: 'Pricing Plans' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/integrations', label: 'Integrations' },
    { href: '/api-docs', label: 'API Documentation' },
  ];

  const companyLinks = [
    { href: '/about', label: 'About DBooster' },
    { href: '/careers', label: 'Careers' },
    { href: '/blog', label: 'Engineering Blog' },
    { href: '/case-studies', label: 'Customer Stories' },
    { href: '/partners', label: 'Partners' },
  ];

  const resourceLinks = [
    { href: '/docs', label: 'Documentation' },
    { href: '/support', label: 'Help Center' },
    { href: '/community', label: 'Developer Community' },
    { href: '/webinars', label: 'Webinars & Events' },
    { href: '/status', label: 'System Status' },
  ];

  const legalLinks = [
    { href: '/terms', label: 'Terms of Service' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/security', label: 'Security & Compliance' },
    { href: '/cookies', label: 'Cookie Policy' },
    { href: '/accessibility', label: 'Accessibility' },
  ];

  return (
    <footer className="bg-background border-t">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <Link to="/" className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-primary to-blue-600 rounded-lg shadow-lg">
                  <Database className="h-7 w-7 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    DBooster
                  </span>
                  <p className="text-sm text-muted-foreground">AI Database Optimizer</p>
                </div>
              </Link>
              
              <p className="text-muted-foreground leading-relaxed max-w-md">
                Enterprise-grade AI-powered database optimization platform. Reduce query response times by up to 73% 
                and cut infrastructure costs by 60%. Built with Israeli innovation and global standards.
              </p>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />
                <span>🇮🇱 Proudly developed in Israel</span>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Stay Updated</h3>
              <p className="text-sm text-muted-foreground">
                Get optimization insights, product updates, and industry best practices.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" disabled={isSubscribed} className="shrink-0">
                  {isSubscribed ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </Button>
              </form>
              {isSubscribed && (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Successfully subscribed! Welcome aboard.
                </p>
              )}
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Product</h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Resources</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Legal */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:hello@dbooster.ai" className="hover:text-foreground transition-colors">
                    hello@dbooster.ai
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+972-3-123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Tel Aviv, Israel</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Legal</h4>
              <ul className="space-y-2">
                {legalLinks.slice(0, 3).map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Security & Compliance Badges */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="outline" className="flex items-center gap-2 px-4 py-2">
              <Shield className="h-4 w-4" />
              SOC 2 Type II
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 px-4 py-2">
              <Shield className="h-4 w-4" />
              ISO 27001
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 px-4 py-2">
              <Shield className="h-4 w-4" />
              GDPR Compliant
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 px-4 py-2">
              <Database className="h-4 w-4" />
              99.9% Uptime SLA
            </Badge>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                Made with <Heart className="h-4 w-4 text-red-500 fill-current" /> in Israel
              </div>
              <div className="hidden sm:block">•</div>
              <div>© {currentYear} DBooster Ltd. All rights reserved.</div>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="h-10 w-10" asChild>
                <a href="https://twitter.com/dbooster" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10" asChild>
                <a href="https://linkedin.com/company/dbooster" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10" asChild>
                <a href="https://github.com/dbooster" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Additional Legal Links */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
              {legalLinks.map((link, index) => (
                <span key={link.href} className="flex items-center gap-6">
                  <Link
                    to={link.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                  {index < legalLinks.length - 1 && <span className="text-muted-foreground/50">•</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
