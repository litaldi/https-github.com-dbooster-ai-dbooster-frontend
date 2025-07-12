
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Github,
  Shield,
  CheckCircle2,
  ArrowRight,
  Star,
  ExternalLink,
  Heart
} from 'lucide-react';
import { footerNavigation, socialProofIndicators, contactInfo } from '@/config/navigation';

export function EnhancedFooter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border/50 mt-auto" dir="ltr">
      {/* Social Proof Banner - Enhanced */}
      <div className="bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 border-b border-border/30">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold text-foreground">Trusted by Industry Leaders</span>
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            </div>
            <p className="text-xs text-muted-foreground">Join thousands of developers optimizing their databases</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-xl font-bold text-primary">{socialProofIndicators.customerCount}</div>
              <div className="text-xs text-muted-foreground">Happy Customers</div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-green-600">{socialProofIndicators.queryOptimizations}</div>
              <div className="text-xs text-muted-foreground">Queries Optimized</div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-blue-600">{socialProofIndicators.averageImprovement}</div>
              <div className="text-xs text-muted-foreground">Avg Performance Boost</div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-purple-600">{socialProofIndicators.costSavings}</div>
              <div className="text-xs text-muted-foreground">Cost Reduction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content - Refined Layout */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Brand Section - Enhanced */}
          <div className="lg:col-span-4 space-y-4">
            <div className="space-y-3">
              <Link to="/" className="flex items-center space-x-3 group w-fit">
                <div className="p-2 bg-gradient-to-r from-primary to-blue-600 rounded-lg shadow-md group-hover:shadow-lg transition-shadow">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    DBooster
                  </span>
                  <p className="text-xs text-muted-foreground">AI Database Optimizer</p>
                </div>
              </Link>
              
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                Enterprise-grade AI-powered database optimization that reduces query response times by up to 73% 
                and cuts infrastructure costs by 60%.
              </p>

              {/* Certifications */}
              <div className="flex flex-wrap gap-1.5">
                {socialProofIndicators.certifications.map((cert) => (
                  <Badge key={cert} variant="outline" className="text-xs px-2 py-0.5 border-border/50">
                    <Shield className="h-3 w-3 mr-1" />
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Newsletter Signup - Refined */}
            <div className="space-y-3 pt-2">
              <h3 className="font-semibold text-sm text-foreground">Stay Updated</h3>
              <p className="text-xs text-muted-foreground">
                Get optimization tips and product updates. Privacy-first, no spam.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-9 text-sm bg-background/50 border-border/50 focus:border-primary/50"
                  required
                  aria-label="Email address for newsletter"
                />
                <Button 
                  type="submit" 
                  disabled={isSubscribed} 
                  size="sm"
                  className="h-9 px-3 bg-primary/90 hover:bg-primary text-primary-foreground"
                  aria-label="Subscribe to newsletter"
                >
                  {isSubscribed ? <CheckCircle2 className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </Button>
              </form>
              {isSubscribed && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Successfully subscribed!
                </p>
              )}
            </div>
          </div>

          {/* Navigation Sections - Improved Grid */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-sm mb-3 text-foreground">Product</h3>
            <nav>
              <ul className="space-y-2">
                {footerNavigation.product.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-semibold text-sm mb-3 text-foreground">Solutions</h3>
            <nav>
              <ul className="space-y-2">
                {footerNavigation.solutions.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-semibold text-sm mb-3 text-foreground">Resources</h3>
            <nav>
              <ul className="space-y-2">
                {footerNavigation.resources.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm mb-3 text-foreground">Company</h3>
                <nav>
                  <ul className="space-y-2">
                    {footerNavigation.company.map((link) => (
                      <li key={link.href}>
                        <Link
                          to={link.href}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 rounded"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              {/* Contact Information - Compact */}
              <div className="space-y-2 pt-2 border-t border-border/30">
                <h4 className="font-medium text-sm text-foreground">Contact</h4>
                <address className="space-y-1.5 text-xs text-muted-foreground not-italic">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 flex-shrink-0" />
                    <a href={`mailto:${contactInfo.email}`} className="hover:text-primary transition-colors">
                      {contactInfo.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 flex-shrink-0" />
                    <a href={`tel:${contactInfo.phone}`} className="hover:text-primary transition-colors">
                      {contactInfo.phone}
                    </a>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-3 w-3 flex-shrink-0 mt-0.5" />
                    <span className="leading-tight">{contactInfo.address}</span>
                  </div>
                </address>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Refined */}
        <div className="mt-8 pt-6 border-t border-border/30">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                Made with <Heart className="h-3 w-3 text-red-500 fill-current" /> by the DBooster team
              </div>
              <div className="hidden md:block text-muted-foreground/50">•</div>
              <div>© 2024 DBooster. All rights reserved.</div>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Legal Links */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {footerNavigation.legal.map((link, index) => (
                  <span key={link.href} className="flex items-center gap-3">
                    <Link
                      to={link.href}
                      className="hover:text-primary transition-colors hover:underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 rounded"
                    >
                      {link.label}
                    </Link>
                    {index < footerNavigation.legal.length - 1 && <span className="text-muted-foreground/50">•</span>}
                  </span>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-2 pl-3 border-l border-border/30">
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent/50" asChild>
                  <a 
                    href={contactInfo.social.linkedin}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Connect on LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent/50" asChild>
                  <a 
                    href={contactInfo.social.twitter}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Follow us on Twitter"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent/50" asChild>
                  <a 
                    href={contactInfo.social.github}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="View our GitHub"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
