
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Optimize Your Database 
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {" "}Performance
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              AI-powered database optimization that reduces costs, improves performance, 
              and prevents issues before they impact your applications.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <EnhancedButton size="lg" asChild className="text-lg px-8">
              <Link to="/demo">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </EnhancedButton>
            <EnhancedButton variant="outline" size="lg" asChild className="text-lg px-8">
              <Link to="/demo">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Link>
            </EnhancedButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative mx-auto max-w-4xl"
          >
            <div className="relative rounded-xl overflow-hidden shadow-2xl bg-card border">
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-blue-600/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-muted-foreground">Dashboard Preview</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
