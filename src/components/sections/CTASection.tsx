
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-blue-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center text-white"
        >
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-white/20 rounded-full">
              <Zap className="h-8 w-8" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Optimize Your Database?
          </h2>
          
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of developers who trust DBooster to keep their databases running at peak performance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <EnhancedButton 
              size="lg" 
              variant="secondary" 
              asChild 
              className="text-lg px-8 bg-white text-primary hover:bg-white/90"
            >
              <Link to="/demo">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </EnhancedButton>
            
            <EnhancedButton 
              size="lg" 
              variant="outline" 
              asChild 
              className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary"
            >
              <Link to="/contact">
                Contact Sales
              </Link>
            </EnhancedButton>
          </div>
          
          <div className="mt-8 text-sm text-white/70">
            <p>No credit card required • 14-day free trial • Cancel anytime</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
