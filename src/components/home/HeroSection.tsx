
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Shield, Zap, TrendingUp, Star, Building, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface HeroSectionProps {
  onGetStarted: () => void;
  onWatchDemo: () => void;
  isLoading: boolean;
  user: any;
}

export function HeroSection({ onGetStarted, onWatchDemo, isLoading, user }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30 py-16 md:py-24">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-primary/10 to-purple-500/10 blur-3xl rounded-full" />
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap gap-3"
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                  Reduce Database Costs by{' '}
                </span>
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  60% with AI
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Transform your database performance with enterprise-grade AI optimization. 
                <strong className="text-foreground"> Reduce query times by 73%</strong>, 
                <strong className="text-foreground"> cut infrastructure costs by 60%</strong>, and 
                <strong className="text-foreground"> automate 80% of performance tuning tasks</strong>.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
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
              className="text-sm text-muted-foreground space-y-2"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>No credit card required • 5-minute setup • Cancel anytime</span>
              </div>
              <div>Join 50,000+ developers already optimizing with DBooster</div>
            </motion.div>
          </div>

          {/* Right Column - Benefits Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="grid gap-4">
              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Zap className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">73% Faster Queries</h3>
                      <p className="text-muted-foreground">AI-powered optimization reduces response times dramatically</p>
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Average improvement across 10,000+ queries</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">60% Cost Reduction</h3>
                      <p className="text-muted-foreground">Lower infrastructure costs through efficient resource usage</p>
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Proven savings across enterprise clients</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <Building className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">Enterprise Ready</h3>
                      <p className="text-muted-foreground">SOC2 compliant with 24/7 support and monitoring</p>
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Trusted by Fortune 500 companies</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
