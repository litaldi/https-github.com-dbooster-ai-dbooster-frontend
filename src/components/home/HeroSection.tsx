
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Shield, Zap, TrendingUp, Star, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeroSectionProps {
  onGetStarted: () => void;
  onWatchDemo: () => void;
  isLoading: boolean;
  user: any;
}

export function HeroSection({ onGetStarted, onWatchDemo, isLoading, user }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30 py-20 md:py-32">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-primary/10 to-purple-500/10 blur-3xl rounded-full" />
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-5xl mx-auto">
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            <Badge variant="secondary" className="px-4 py-2 bg-primary/10 text-primary border-primary/20">
              <Star className="h-3 w-3 mr-2" />
              50,000+ Developers Trust DBooster
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 bg-green-50 text-green-700 border-green-200">
              <Shield className="h-3 w-3 mr-2" />
              SOC2 Certified
            </Badge>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
              Reduce Database Costs by{' '}
            </span>
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              60% with AI
            </span>
          </motion.h1>

          {/* Value Proposition */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Transform your database performance with enterprise-grade AI optimization. 
            <strong className="text-foreground"> Reduce query times by 73%</strong>, 
            <strong className="text-foreground"> cut infrastructure costs by 60%</strong>, and 
            <strong className="text-foreground"> automate 80% of performance tuning tasks</strong>.
          </motion.p>

          {/* Key Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Zap className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">73% Faster Queries</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-900">60% Cost Reduction</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <Building className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Enterprise Ready</span>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <Button
              size="lg"
              onClick={onGetStarted}
              disabled={isLoading}
              className="min-w-[220px] h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <Zap className="h-5 w-5" />
                  </motion.div>
                  Starting optimization...
                </>
              ) : (
                <>
                  {user ? 'Access Your Dashboard' : 'Start Free Optimization'}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={onWatchDemo}
              className="min-w-[220px] h-14 text-lg font-semibold border-2 hover:bg-accent/10"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch 2-Min Demo
            </Button>
          </motion.div>
          
          {/* Trust Signals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-sm text-muted-foreground"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>No credit card required • 5-minute setup • Cancel anytime</span>
            </div>
            <div>Join 50,000+ developers already optimizing with DBooster</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
