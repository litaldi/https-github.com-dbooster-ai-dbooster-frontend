
import { Heart, Github, Twitter, Linkedin, Mail, Phone, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { user } = useAuth();

  const productLinks = [
    { href: '/features', label: 'Features' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/learn', label: 'Learn' },
    { href: '/blog', label: 'Blog' },
  ];

  const companyLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/support', label: 'Support' },
  ];

  const legalLinks = [
    { href: '/terms', label: 'Terms of Service' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/accessibility', label: 'Accessibility' },
  ];

  const dashboardLinks = user ? [
    { href: '/app', label: 'Dashboard' },
    { href: '/queries', label: 'Queries' },
    { href: '/repositories', label: 'Repositories' },
    { href: '/reports', label: 'Reports' },
    { href: '/ai-studio', label: 'AI Studio' },
  ] : [];

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
                </svg>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DBooster
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              AI-powered database query optimization that reduces response times by up to 10x 
              and cuts infrastructure costs by 60%. Transform your database performance today.
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Product</h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboard or Legal Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">{user ? 'Dashboard' : 'Legal'}</h3>
            <ul className="space-y-3">
              {(user ? dashboardLinks : legalLinks).map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Get in Touch</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href="mailto:support@dbooster.ai" className="hover:text-foreground transition-colors">
                  support@dbooster.ai
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Resources</h4>
              <div className="flex flex-wrap gap-4 text-sm">
                <Link 
                  to="/support" 
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  Documentation
                  <ExternalLink className="h-3 w-3" />
                </Link>
                <Link 
                  to="/support" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Help Center
                </Link>
                <Link 
                  to="/blog" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Blog
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                Made with <Heart className="h-4 w-4 text-red-500 fill-current" /> by the DBooster team
              </div>
              <div className="hidden md:block">•</div>
              <div>© {currentYear} DBooster. All rights reserved.</div>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {legalLinks.map((link, index) => (
                <span key={link.href} className="flex items-center gap-4">
                  <Link
                    to={link.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                  {index < legalLinks.length - 1 && <span>•</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
