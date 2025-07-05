
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Database, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GlobalLoadingOverlayProps {
  className?: string;
}

export function GlobalLoadingOverlay({ className }: GlobalLoadingOverlayProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [loadingStage, setLoadingStage] = useState(0);

  const loadingStages = [
    { icon: Database, text: 'Initializing DBooster...', color: 'text-blue-500' },
    { icon: Zap, text: 'Loading optimization engine...', color: 'text-yellow-500' },
    { icon: Loader2, text: 'Preparing your workspace...', color: 'text-green-500' }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    const stageTimer = setInterval(() => {
      setLoadingStage(prev => (prev + 1) % loadingStages.length);
    }, 600);

    return () => {
      clearTimeout(timer);
      clearInterval(stageTimer);
    };
  }, []);

  const currentStage = loadingStages[loadingStage];
  const IconComponent = currentStage.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center",
            className
          )}
        >
          <div className="text-center">
            <motion.div
              key={loadingStage}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <div className="relative">
                <IconComponent 
                  className={cn(
                    "h-12 w-12 mx-auto",
                    currentStage.color,
                    currentStage.icon === Loader2 && "animate-spin"
                  )}
                />
                <div className="absolute inset-0 animate-ping">
                  <IconComponent 
                    className={cn("h-12 w-12 mx-auto opacity-20", currentStage.color)}
                  />
                </div>
              </div>
            </motion.div>

            <motion.h2
              key={`text-${loadingStage}`}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-xl font-semibold mb-2"
            >
              {currentStage.text}
            </motion.h2>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              className="w-48 h-1 bg-muted rounded-full mx-auto overflow-hidden"
            >
              <div className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full" />
            </motion.div>

            <p className="text-sm text-muted-foreground mt-4">
              Setting up your database optimization experience...
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
