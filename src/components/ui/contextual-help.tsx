
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedTooltip } from '@/components/ui/enhanced-tooltip';
import { 
  HelpCircle, 
  Keyboard, 
  Lightbulb, 
  X, 
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

interface HelpTipProps {
  title: string;
  description: string;
  trigger?: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export function HelpTip({ title, description, trigger, side = 'top' }: HelpTipProps) {
  const defaultTrigger = (
    <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
  );

  return (
    <EnhancedTooltip
      content={
        <div className="max-w-xs">
          <div className="font-medium text-sm mb-1">{title}</div>
          <div className="text-xs opacity-90">{description}</div>
        </div>
      }
      side={side}
    >
      {trigger || defaultTrigger}
    </EnhancedTooltip>
  );
}

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  const { shortcuts } = useKeyboardShortcuts();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="w-full max-w-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Keyboard className="h-5 w-5" />
                  Keyboard Shortcuts
                </CardTitle>
                <EnhancedButton variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </EnhancedButton>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {shortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.ctrlKey && (
                          <Badge variant="outline" className="text-xs px-2 py-1">
                            Ctrl
                          </Badge>
                        )}
                        {shortcut.altKey && (
                          <Badge variant="outline" className="text-xs px-2 py-1">
                            Alt
                          </Badge>
                        )}
                        {shortcut.shiftKey && (
                          <Badge variant="outline" className="text-xs px-2 py-1">
                            Shift
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs px-2 py-1">
                          {shortcut.key.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ContextualHelp() {
  const [showShortcuts, setShowShortcuts] = useState(false);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
        <EnhancedTooltip content="View keyboard shortcuts" side="left">
          <EnhancedButton
            variant="outline"
            size="icon"
            onClick={() => setShowShortcuts(true)}
            className="h-10 w-10 rounded-full shadow-lg bg-background border"
          >
            <Keyboard className="h-4 w-4" />
          </EnhancedButton>
        </EnhancedTooltip>
        
        <EnhancedTooltip content="Need help? Press Ctrl+/ for shortcuts" side="left">
          <EnhancedButton
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full shadow-lg bg-background border"
          >
            <Info className="h-4 w-4" />
          </EnhancedButton>
        </EnhancedTooltip>
      </div>

      <KeyboardShortcutsModal 
        isOpen={showShortcuts} 
        onClose={() => setShowShortcuts(false)} 
      />
    </>
  );
}

interface SmartTipProps {
  children: React.ReactNode;
  tip: {
    title: string;
    description: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
}

export function SmartTip({ children, tip }: SmartTipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 z-50"
          >
            <Card className="w-80 shadow-lg border-2 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">{tip.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {tip.description}
                    </p>
                    {tip.action && (
                      <EnhancedButton 
                        size="sm" 
                        variant="outline" 
                        onClick={tip.action.onClick}
                        className="h-7 px-3 text-xs"
                      >
                        {tip.action.label}
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </EnhancedButton>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
