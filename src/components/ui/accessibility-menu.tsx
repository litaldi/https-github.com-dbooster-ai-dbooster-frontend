import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useFocusManagement } from '@/hooks/useFocusManagement';
import { Accessibility } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AccessibilityFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    preferences,
    toggleHighContrast,
    toggleReducedMotion,
    toggleLargeText,
    toggleScreenReaderOptimized,
    resetToDefaults
  } = useAccessibility();

  const { containerRef } = useFocusManagement(isOpen, {
    trapFocus: true,
    restoreFocus: true,
    initialFocus: 'first'
  });

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Open accessibility settings"
        size="sm"
      >
        <Accessibility className="h-5 w-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              ref={containerRef as React.RefObject<HTMLDivElement>}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Accessibility className="h-5 w-5" />
                    Accessibility Settings
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Customize your experience for better accessibility
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="high-contrast" className="text-sm font-medium">
                        High Contrast Mode
                      </Label>
                      <Switch
                        id="high-contrast"
                        checked={preferences.highContrast}
                        onCheckedChange={toggleHighContrast}
                        aria-describedby="high-contrast-desc"
                      />
                    </div>
                    <p id="high-contrast-desc" className="text-xs text-muted-foreground">
                      Increases color contrast for better visibility
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="reduced-motion" className="text-sm font-medium">
                        Reduce Motion
                      </Label>
                      <Switch
                        id="reduced-motion"
                        checked={preferences.reducedMotion}
                        onCheckedChange={toggleReducedMotion}
                        aria-describedby="reduced-motion-desc"
                      />
                    </div>
                    <p id="reduced-motion-desc" className="text-xs text-muted-foreground">
                      Minimizes animations and transitions
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="large-text" className="text-sm font-medium">
                        Large Text
                      </Label>
                      <Switch
                        id="large-text"
                        checked={preferences.largeText}
                        onCheckedChange={toggleLargeText}
                        aria-describedby="large-text-desc"
                      />
                    </div>
                    <p id="large-text-desc" className="text-xs text-muted-foreground">
                      Increases text size for better readability
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="screen-reader" className="text-sm font-medium">
                        Screen Reader Optimized
                      </Label>
                      <Switch
                        id="screen-reader"
                        checked={preferences.screenReaderOptimized}
                        onCheckedChange={toggleScreenReaderOptimized}
                        aria-describedby="screen-reader-desc"
                      />
                    </div>
                    <p id="screen-reader-desc" className="text-xs text-muted-foreground">
                      Enhanced experience for screen readers
                    </p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => setIsOpen(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Close
                    </Button>
                    <Button
                      onClick={resetToDefaults}
                      variant="ghost"
                      className="flex-1"
                    >
                      Reset to Defaults
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
