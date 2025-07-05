
import { Outlet } from 'react-router-dom';
import { EnhancedHeader } from '@/components/layout/enhanced-header';
import { Toaster } from 'sonner';
import { 
  Home, 
  Zap, 
  Database, 
  BarChart3, 
  Users, 
  HelpCircle, 
  DollarSign,
  BookOpen,
  Newspaper,
  Mail
} from 'lucide-react';

export function PublicLayout() {
  const navigation = [
    {
      name: 'Home',
      href: '/',
      icon: <Home className="h-4 w-4" />
    },
    {
      name: 'Features',
      href: '/features',
      icon: <Zap className="h-4 w-4" />,
      badge: 'New'
    },
    {
      name: 'Solutions',
      href: '/how-it-works',
      icon: <Database className="h-4 w-4" />,
      children: [
        {
          name: 'How It Works',
          href: '/how-it-works',
          icon: <Database className="h-4 w-4" />
        },
        {
          name: 'AI Studio',
          href: '/ai-studio',
          icon: <Zap className="h-4 w-4" />,
          badge: 'Try Now'
        }
      ]
    },
    {
      name: 'Pricing',
      href: '/pricing',
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      name: 'Resources',
      href: '/learn',
      icon: <BookOpen className="h-4 w-4" />,
      children: [
        {
          name: 'Learning Hub',
          href: '/learn',
          icon: <BookOpen className="h-4 w-4" />
        },
        {
          name: 'Blog',
          href: '/blog',
          icon: <Newspaper className="h-4 w-4" />
        },
        {
          name: 'Support',
          href: '/support',
          icon: <HelpCircle className="h-4 w-4" />
        }
      ]
    },
    {
      name: 'Company',
      href: '/about',
      icon: <Users className="h-4 w-4" />,
      children: [
        {
          name: 'About Us',
          href: '/about',
          icon: <Users className="h-4 w-4" />
        },
        {
          name: 'Contact',
          href: '/contact',
          icon: <Mail className="h-4 w-4" />
        }
      ]
    }
  ];

  const handleSearch = (query: string) => {
    // Implement search functionality
    console.log('Searching for:', query);
  };

  const handleGetStarted = () => {
    // Navigate to sign up or demo
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <EnhancedHeader
        navigation={navigation}
        logo={{
          text: 'DBooster',
          icon: <Zap className="h-6 w-6 text-white" />
        }}
        searchEnabled={true}
        onSearch={handleSearch}
        ctaButton={{
          text: 'Get Started Free',
          onClick: handleGetStarted,
          variant: 'default'
        }}
      />
      
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      
      <footer className="bg-muted/30 border-t py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary rounded-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold">DBooster</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered database optimization for enterprise performance excellence.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="/pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="/ai-studio" className="hover:text-foreground transition-colors">AI Studio</a></li>
                <li><a href="/how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/learn" className="hover:text-foreground transition-colors">Learning Hub</a></li>
                <li><a href="/blog" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="/support" className="hover:text-foreground transition-colors">Support</a></li>
                <li><a href="/accessibility" className="hover:text-foreground transition-colors">Accessibility</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/about" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="/contact" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="/terms" className="hover:text-foreground transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 DBooster. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-xs text-muted-foreground">SOC2 Compliant</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">Enterprise Ready</span>
            </div>
          </div>
        </div>
      </footer>
      
      <Toaster 
        position="top-right"
        expand={true}
        richColors
        closeButton
      />
    </div>
  );
}
