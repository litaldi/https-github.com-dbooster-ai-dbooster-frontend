
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
  ExternalLink
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
    <footer className="bg-background border-t" dir="ltr">
      {/* Social Proof Banner */}
      <div className="bg-gradient-to-r from-primary/5 via-blue-500/5 to-purple-500/5 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="text-lg font-semibold">Trusted by Industry Leaders</span>
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            </div>
            <p className="text-muted-foreground">Join thousands of developers optimizing their databases</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">{socialProofIndicators.customerCount}</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-600">{socialProofIndicators.queryOptimizations}</div>
              <div className="text-sm text-muted-foreground">Queries Optimized</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">{socialProofIndicators.averageImprovement}</div>
              <div className="text-sm text-muted-foreground">Avg Performance Boost</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-600">{socialProofIndicators.costSavings}</div>
              <div className="text-sm text-muted-foreground">Cost Reduction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="p-3 bg-gradient-to-r from-primary to-blue-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    DBooster
                  </span>
                  <p className="text-sm text-muted-foreground">AI Database Optimizer</p>
                </div>
              </Link>
              
              <p className="text-muted-foreground max-w-md leading-relaxed">
                Enterprise-grade AI-powered database optimization that reduces query response times by up to 73% 
                and cuts infrastructure costs by 60%. Transform your database performance today.
              </p>

              {/* Certifications */}
              <div className="flex flex-wrap gap-2">
                {socialProofIndicators.certifications.map((cert) => (
                  <Badge key={cert} variant="outline" className="flex items-center gap-1 text-xs">
                    <Shield className="h-3 w-3" />
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Stay Updated</h3>
              <p className="text-sm text-muted-foreground">
                Get the latest optimization tips and product updates. Privacy-first, no spam.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                  aria-label="Email address for newsletter"
                />
                <Button type="submit" disabled={isSubscribed} aria-label="Subscribe to newsletter">
                  {isSubscribed ? <CheckCircle2 className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </Button>
              </form>
              {isSubscribed && (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Successfully subscribed!
                </p>
              )}
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">Product</h3>
              <nav>
                <ul className="space-y-3">
                  {footerNavigation.product.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">Solutions</h3>
              <nav>
                <ul className="space-y-3">
                  {footerNavigation.solutions.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <nav>
                <ul className="space-y-3">
                  {footerNavigation.resources.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <nav>
                <ul className="space-y-3">
                  {footerNavigation.company.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Support Section */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Support</h3>
              <nav>
                <ul className="space-y-3">
                  {footerNavigation.support.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-medium">Contact Info</h4>
              <address className="space-y-2 text-sm text-muted-foreground not-italic">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${contactInfo.email}`} className="hover:text-primary transition-colors">
                    {contactInfo.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${contactInfo.phone}`} className="hover:text-primary transition-colors">
                    {contactInfo.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{contactInfo.address}</span>
                </div>
              </address>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
              <div>© 2024 DBooster. All rights reserved.</div>
              <div className="flex items-center gap-4">
                {footerNavigation.legal.map((link, index) => (
                  <span key={link.href} className="flex items-center gap-4">
                    <Link
                      to={link.href}
                      className="hover:text-primary transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                    >
                      {link.label}
                    </Link>
                    {index < footerNavigation.legal.length - 1 && <span>•</span>}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="h-10 w-10" asChild>
                <a 
                  href={contactInfo.social.linkedin}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Connect on LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                  <ExternalLink className="sr-only" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10" asChild>
                <a 
                  href={contactInfo.social.twitter}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="h-5 w-5" />
                  <ExternalLink className="sr-only" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10" asChild>
                <a 
                  href={contactInfo.social.github}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="View our GitHub"
                >
                  <Github className="h-5 w-5" />
                  <ExternalLink className="sr-only" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
