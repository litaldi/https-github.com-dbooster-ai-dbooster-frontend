
import * as React from 'react';
import { Link } from 'react-router-dom';
import { EnhancedButton } from './enhanced-button';
import { Input } from './input';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Github,
  Globe,
  Shield,
  CheckCircle2,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterSection {
  title: string;
  links: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
}

interface EnhancedFooterProps {
  sections: FooterSection[];
  companyInfo?: {
    name: string;
    description: string;
    logo?: React.ReactNode;
  };
  contactInfo?: {
    email: string;
    phone: string;
    address: string;
  };
  socialLinks?: Array<{
    name: string;
    href: string;
    icon: React.ReactNode;
  }>;
  certifications?: string[];
  newsletter?: {
    title: string;
    description: string;
    placeholder: string;
  };
  className?: string;
}

export function EnhancedFooter({
  sections,
  companyInfo = {
    name: 'DBooster',
    description: 'Enterprise-grade AI-powered database optimization that reduces query response times by up to 73% and cuts infrastructure costs by 60%.'
  },
  contactInfo = {
    email: 'support@dbooster.ai',
    phone: '+1 (555) 123-4567',
    address: 'San Francisco, CA'
  },
  socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com', icon: <Twitter className="h-4 w-4" /> },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: <Linkedin className="h-4 w-4" /> },
    { name: 'GitHub', href: 'https://github.com', icon: <Github className="h-4 w-4" /> },
  ],
  certifications = ['SOC2 Type II', 'GDPR Compliant', 'ISO 27001'],
  newsletter = {
    title: 'Stay Updated',
    description: 'Get the latest optimization tips and product updates. Privacy-first, no spam.',
    placeholder: 'Enter your email'
  },
  className,
}: EnhancedFooterProps) {
  const [email, setEmail] = React.useState('');
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubscribed(true);
    setEmail('');
    setIsLoading(false);
    
    // Reset success state after 3 seconds
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <footer className={cn("bg-background border-t", className)}>
      {/* Social Proof Banner */}
      <div className="bg-gradient-to-r from-primary/5 via-blue-500/5 to-purple-500/5 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">50,000+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">10M+</div>
              <div className="text-sm text-muted-foreground">Queries Optimized</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-600">73%</div>
              <div className="text-sm text-muted-foreground">Avg Performance Boost</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-purple-600">60%</div>
              <div className="text-sm text-muted-foreground">Cost Reduction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="p-2 bg-gradient-to-r from-primary to-blue-600 rounded-lg transition-transform group-hover:scale-105">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    {companyInfo.name}
                  </span>
                  <p className="text-sm text-muted-foreground">AI Database Optimizer</p>
                </div>
              </Link>
              
              <p className="text-muted-foreground max-w-md leading-relaxed">
                {companyInfo.description}
              </p>
            </div>

            {/* Newsletter Signup */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{newsletter.title}</h3>
              <p className="text-sm text-muted-foreground">
                {newsletter.description}
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder={newsletter.placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                  disabled={isLoading}
                />
                <EnhancedButton 
                  type="submit" 
                  loading={isLoading}
                  disabled={isSubscribed}
                  variant={isSubscribed ? "outline" : "default"}
                >
                  {isSubscribed ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </EnhancedButton>
              </form>
              {isSubscribed && (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Successfully subscribed!
                </p>
              )}
            </div>

            {/* Language/Region Selector */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Region</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />
                <span>English (US)</span>
              </div>
            </div>
          </div>

          {/* Navigation Sections */}
          {sections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-semibold text-lg">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                      {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Information */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${contactInfo.email}`} className="hover:underline">
                    {contactInfo.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{contactInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{contactInfo.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {certifications.map((cert) => (
                <div key={cert} className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-xs font-medium">
                  <Shield className="h-3 w-3" />
                  {cert}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Section */}
        <div className={cn("pt-6", certifications.length === 0 && "mt-12 border-t")}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-muted-foreground">
              © 2024 {companyInfo.name}. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <EnhancedButton
                  key={social.name}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  asChild
                >
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                </EnhancedButton>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
