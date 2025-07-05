
import React, { forwardRef } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TooltipGuidanceProps {
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  children?: React.ReactNode;
}

export const TooltipGuidance = forwardRef<HTMLButtonElement, TooltipGuidanceProps>(
  ({ content, side = 'top', className, children }, ref) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              ref={ref}
              type="button"
              className={cn(
                'inline-flex items-center justify-center rounded-full p-1 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                className
              )}
              aria-label="Help information"
            >
              {children || <HelpCircle className="h-4 w-4" />}
            </button>
          </TooltipTrigger>
          <TooltipContent side={side}>
            <p className="max-w-xs text-sm">{content}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);

TooltipGuidance.displayName = 'TooltipGuidance';
