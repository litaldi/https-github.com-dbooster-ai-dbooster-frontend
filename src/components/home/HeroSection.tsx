
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Database, Zap, Shield, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeroSectionProps {
  onGetStarted: () => void;
  onWatchDemo: () => void;
  isLoading: boolean;
  user: any;
}

export function HeroSection({ onGetStarted, onWatchDemo, isLoading, user }: HeroSectionProps) {
  const features = [
    { icon: Database, text: "AI-Powered Query Optimization" },
    { icon: TrendingUp, text: "Up to 73% Performance Boost" },
    { icon: Shield, text: "Enterprise-Grade Security" },
    { icon: Zap, text: "Real-time Monitoring" }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="px-4 py-2 text-sm bg-primary/10 border-primary/20 text-primary">
              🇮🇱 Proudly Built in Israel • Trusted by Enterprise Teams
            </Badge>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Transform Database
              </span>
              <br />
              <span className="text-foreground">Performance with AI</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Reduce query response times by <strong className="text-green-600">73%</strong> and 
              cut infrastructure costs by <strong className="text-blue-600">60%</strong> with 
              enterprise-grade AI optimization.
            </p>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm border rounded-full text-sm font-medium"
              >
                <feature.icon className="h-4 w-4 text-primary" />
                {feature.text}
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              onClick={onGetStarted}
              disabled={isLoading}
              className="min-w-[200px] h-14 text-lg font-semibold bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {user ? 'Open Dashboard' : 'Start Free Analysis'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={onWatchDemo}
              className="min-w-[200px] h-14 text-lg font-semibold border-2 hover:bg-accent/50"
            >
              Watch Live Demo
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-8 space-y-2"
          >
            <p className="text-sm text-muted-foreground">
              Trusted by 1,200+ companies worldwide
            </p>
            <div className="flex justify-center items-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                SOC 2 Compliant
              </span>
              <span className="flex items-center gap-1">
                <Database className="h-3 w-3" />
                GDPR Ready
              </span>
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                99.9% Uptime SLA
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
