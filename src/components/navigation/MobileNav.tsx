
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileNav({ children, className }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'md:hidden relative',
            'hover:bg-accent focus-visible:bg-accent',
            'transition-all duration-200',
            'min-h-[44px] min-w-[44px]', // Mobile touch target
            className
          )}
          aria-label="Open mobile menu"
        >
          <AnimatePresence mode="wait">
            {!isOpen ? (
              <motion.div
                key="menu"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="left" 
        className="w-[300px] sm:w-[350px] p-0 bg-background/95 backdrop-blur-lg border-r"
      >
        <motion.div 
          className="flex flex-col h-full"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="flex items-center justify-between p-6 border-b">
            <motion.h2 
              className="text-lg font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Menu
            </motion.h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-6 scrollbar-enhanced">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              {children}
            </motion.div>
          </nav>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}

interface MobileNavItemProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  active?: boolean;
}

export function MobileNavItem({ 
  href, 
  children, 
  icon, 
  className,
  onClick,
  active = false
}: MobileNavItemProps) {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      whileHover={{ x: 4, backgroundColor: 'hsl(var(--accent))' }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'flex items-center gap-3 px-4 py-4 rounded-lg text-sm font-medium',
        'hover:bg-accent hover:text-accent-foreground',
        'transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'min-h-[48px]', // Enhanced touch target for mobile
        active && 'bg-accent text-accent-foreground',
        className
      )}
    >
      {icon && (
        <span className="flex-shrink-0 text-lg">
          {icon}
        </span>
      )}
      <span className="flex-1">{children}</span>
    </motion.a>
  );
}

export function MobileNavSection({ 
  title, 
  children 
}: { 
  title: string; 
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <motion.h3 
        className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {title}
      </motion.h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}
