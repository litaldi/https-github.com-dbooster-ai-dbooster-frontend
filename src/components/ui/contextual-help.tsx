
import React, { useState, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

interface HelpTip {
  id: string;
  title: string;
  content: string;
  position: { x: number; y: number };
}

export function ContextualHelp() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState<HelpTip | null>(null);

  const helpTips: HelpTip[] = [
    {
      id: 'dashboard',
      title: 'Dashboard Overview',
      content: 'Your main dashboard shows key metrics and recent activity.',
      position: { x: 20, y: 20 }
    },
    {
      id: 'queries',
      title: 'Query Management',
      content: 'Manage and optimize your database queries here.',
      position: { x: 20, y: 80 }
    }
  ];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F1' || (e.ctrlKey && e.key === 'h')) {
        e.preventDefault();
        setIsVisible(!isVisible);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isVisible]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg"
        onClick={() => setIsVisible(!isVisible)}
        aria-label="Toggle help"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-16 right-4 z-50"
          >
            <Card className="w-80">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quick Help</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsVisible(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Press F1 or Ctrl+H for help
                </p>
                <div className="space-y-1">
                  {helpTips.map((tip) => (
                    <button
                      key={tip.id}
                      className="w-full text-left text-xs p-2 rounded hover:bg-accent"
                      onClick={() => setCurrentTip(tip)}
                    >
                      {tip.title}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
