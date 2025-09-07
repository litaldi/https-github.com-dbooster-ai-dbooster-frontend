
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { StandardizedCTAButton } from '@/components/ui/standardized-cta-button';
import { Zap, Shield, TrendingUp, Users } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export function EnhancedCTASection() {
  const shouldReduceMotion = useReducedMotion();
  
  const features = [
    {
      icon: Zap,
      text: "73% faster queries",
      color: "text-yellow-400"
    },
    {
      icon: TrendingUp,
      text: "60% cost reduction",
      color: "text-green-400"
    },
    {
      icon: Shield,
      text: "Enterprise security",
      color: "text-blue-400"
    },
    {
      icon: Users,
      text: "50,000+ developers",
      color: "text-purple-400"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: shouldReduceMotion ? 0 : 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-600/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
      
      {/* Floating elements for visual interest */}
      {!shouldReduceMotion && (
        <>
          <motion.div
            className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full opacity-60"
            animate={{
              y: [0, -20, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full opacity-40"
            animate={{
              y: [0, 15, 0],
              x: [0, 10, 0],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </>
      )}
      
      <div className="container-fluid relative">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          {/* Main Heading */}
          <motion.div
            variants={itemVariants}
            className="space-y-6"
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 px-6 py-2 text-sm font-medium">
              <Zap className="h-4 w-4 mr-2" />
              AI-Powered Database Optimization
            </Badge>
            
            <h1 className="heading-display gradient-text-enhanced">
              Supercharge Your Database Performance
            </h1>
            
            <p className="body-large max-w-2xl mx-auto">
              Join 50,000+ developers who trust DBooster to optimize their database queries, 
              reduce costs by 60%, and improve performance by 73% with AI-powered insights.
            </p>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={shouldReduceMotion ? {} : { 
                  scale: 1.05, 
                  transition: { duration: 0.2 } 
                }}
                className="flex items-center gap-3 p-4 rounded-xl bg-background/60 border border-border/50 backdrop-blur-sm transition-all duration-200 hover:bg-background/80 hover:border-border/70 hover:shadow-lg cursor-default"
              >
                <feature.icon className={`h-5 w-5 ${feature.color}`} />
                <span className="text-sm font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <StandardizedCTAButton
              size="lg"
              className="btn-cta-enhanced group h-14 px-8 text-base font-semibold"
            />
            
            <StandardizedCTAButton
              ctaType="demo"
              size="lg"
              className="h-14 px-8 text-base font-medium border-border/60 hover:border-border bg-background/50 backdrop-blur-sm"
            />
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground pt-8"
          >
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-400" />
              <span>SOC2 Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-400" />
              <span>5-minute setup</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-400" />
              <span>Free forever plan</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
