
import React from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface EnhancedButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export function EnhancedButton({ 
  children, 
  className, 
  ...props 
}: EnhancedButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.1 }}
    >
      <Button 
        className={cn(
          "transition-all duration-200 hover:shadow-md",
          className
        )} 
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}
