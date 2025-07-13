
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'react-router-dom';
import { HelpCircle, X, Keyboard, Lightbulb } from 'lucide-react';

const helpContent: Record<string, { title: string; tips: string[]; shortcuts?: { key: string; action: string }[] }> = {
  '/': {
    title: 'Welcome to DBooster',
    tips: [
      'Click "Get Started Free" to begin your optimization journey',
      'Explore features to see what DBooster can do for you',
      'Check out the demo to see real-time optimization'
    ]
  },
  '/app': {
    title: 'Dashboard Help',
    tips: [
      'View real-time performance metrics in the cards above',
      'Use the tabs to navigate between different views',
      'Click on charts for detailed insights'
    ],
    shortcuts: [
      { key: 'Ctrl+1', action: 'Switch to Overview' },
      { key: 'Ctrl+2', action: 'Switch to Analytics' },
      { key: 'Ctrl+K', action: 'Open Search' }
    ]
  },
  '/features': {
    title: 'Features Overview',
    tips: [
      'Each feature card shows key benefits and capabilities',
      'Click "Try Demo" to see features in action',
      'Visit pricing to see which features are included in each plan'
    ]
  }
};

export function ContextualHelp() {
  const [isVisible, setIsVisible] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const location = useLocation();

  const currentHelp = helpContent[location.pathname];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setIsVisible(!isVisible);
      }
      if (e.key === 'Escape') {
        setIsVisible(false);
        setShowShortcuts(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  if (!currentHelp) return null;

  return (
    <>
      {/* Help Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2 }}
      >
        <Button
          onClick={() => setIsVisible(!isVisible)}
          size="icon"
          className="rounded-full shadow-lg bg-primary hover:bg-primary/90"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </motion.div>

      {/* Help Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed bottom-20 right-6 z-50 w-80"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="shadow-xl border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-sm">{currentHelp.title}</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsVisible(false)}
                    className="h-6 w-6"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="space-y-2">
                    {currentHelp.tips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{tip}</span>
                      </div>
                    ))}
                  </div>

                  {currentHelp.shortcuts && (
                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-xs">Keyboard Shortcuts</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowShortcuts(!showShortcuts)}
                          className="h-6 text-xs"
                        >
                          <Keyboard className="h-3 w-3 mr-1" />
                          {showShortcuts ? 'Hide' : 'Show'}
                        </Button>
                      </div>
                      
                      <AnimatePresence>
                        {showShortcuts && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-1"
                          >
                            {currentHelp.shortcuts.map((shortcut, index) => (
                              <div key={index} className="flex items-center justify-between text-xs">
                                <Badge variant="outline" className="text-xs font-mono">
                                  {shortcut.key}
                                </Badge>
                                <span className="text-muted-foreground">{shortcut.action}</span>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  <div className="pt-2 text-xs text-muted-foreground">
                    Press <Badge variant="outline" className="text-xs">Ctrl+/</Badge> to toggle help
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
