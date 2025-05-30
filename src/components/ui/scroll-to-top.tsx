
import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { EnhancedButton } from './enhanced-button';
import { cn } from '@/lib/utils';

interface ScrollToTopProps {
  threshold?: number;
  className?: string;
}

export function ScrollToTop({ threshold = 400, className }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 transition-all duration-300",
      "animate-fade-in",
      className
    )}>
      <EnhancedButton
        onClick={scrollToTop}
        size="icon"
        className="w-12 h-12 rounded-full shadow-lg hover:shadow-xl"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </EnhancedButton>
    </div>
  );
}
