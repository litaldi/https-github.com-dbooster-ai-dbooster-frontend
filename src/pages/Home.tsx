
import { useState } from 'react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import { Database, Zap, Shield, TrendingUp, Users, Code, ArrowRight, Star } from 'lucide-react';
import { showSuccess } from '@/components/ui/feedback-toast';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';

export default function Home() {
  const { user, loginDemo } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = async () => {
    setIsLoading(true);
    
    try {
      if (user) {
        showSuccess({ 
          title: 'Redirecting to Dashboard', 
          description: 'Taking you to your dashboard...' 
        });
        navigate('/');
      } else {
        await loginDemo();
        showSuccess({ 
          title: 'Demo Started!', 
          description: 'Welcome to the DBooster demo experience.' 
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Database,
      title: "Smart Query Analysis",
      description: "AI-powered analysis of your SQL queries to identify performance bottlenecks and optimization opportunities.",
      highlight: false
    },
    {
      icon: Zap,
      title: "Real-time Optimization",
      description: "Get instant suggestions to improve query performance with detailed execution plans and recommendations.",
      highlight: true
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC2 compliant with enterprise-grade security features and team collaboration tools.",
      highlight: false
    },
    {
      icon: TrendingUp,
      title: "Performance Insights",
      description: "Track query performance trends and database health metrics with comprehensive analytics.",
      highlight: true
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share optimizations, review queries, and collaborate with your team on database improvements.",
      highlight: false
    },
    {
      icon: Code,
      title: "GitHub Integration",
      description: "Seamlessly connect your repositories and automatically scan for SQL queries that need optimization.",
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen">
      <BreadcrumbNav />
      
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 md:px-6 text-center bg-gradient-to-b from-background to-muted/50">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4 animate-fade-in">
            <Star className="h-3 w-3 mr-1" />
            AI-Powered Database Optimization
          </Badge>
          <h1 className="text-3xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent animate-fade-in">
            Optimize Your Database Performance with AI
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            DBooster uses advanced AI to analyze your SQL queries, identify performance issues, and provide intelligent optimization recommendations that can improve your database performance by up to 10x.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <EnhancedButton 
              size="lg" 
              onClick={handleGetStarted} 
              className="text-lg px-8 min-h-[48px] min-w-[120px]"
              loading={isLoading}
              loadingText="Starting..."
            >
              {user ? 'Go to Dashboard' : 'Try Free Demo'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </EnhancedButton>
            <EnhancedButton 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/login')} 
              className="text-lg px-8 min-h-[48px]"
            >
              {user ? 'Settings' : 'Sign In'}
            </EnhancedButton>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Everything You Need for Database Optimization
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools and insights to help you optimize your database performance and reduce costs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer group ${
                  feature.highlight ? 'ring-2 ring-primary/20 bg-primary/5' : ''
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg transition-colors ${
                      feature.highlight 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                    }`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    {feature.highlight && (
                      <Badge variant="default" className="text-xs">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg md:text-xl group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm md:text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Ready to Optimize Your Database?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Join thousands of developers who have improved their database performance with DBooster.
          </p>
          <EnhancedButton 
            size="lg" 
            onClick={handleGetStarted} 
            className="text-lg px-8 min-h-[48px]"
            loading={isLoading}
            loadingText="Getting Started..."
          >
            Get Started Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </EnhancedButton>
        </div>
      </section>
    </div>
  );
}
