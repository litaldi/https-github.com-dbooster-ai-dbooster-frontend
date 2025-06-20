
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Accessibility, X, Palette, Type, Zap } from 'lucide-react';
import { useAccessibility } from '@/hooks/useAccessibility';

export function EnhancedAccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    preferences,
    toggleHighContrast,
    toggleReducedMotion,
    toggleLargeText,
    toggleScreenReaderOptimized,
  } = useAccessibility();

  const [fontSize, setFontSize] = useState([100]);
  const [lineHeight, setLineHeight] = useState([1.5]);

  const applyFontSettings = () => {
    const root = document.documentElement;
    root.style.setProperty('--accessibility-font-size', `${fontSize[0]}%`);
    root.style.setProperty('--accessibility-line-height', lineHeight[0].toString());
  };

  const resetToDefaults = () => {
    setFontSize([100]);
    setLineHeight([1.5]);
    // Reset all preferences to false
    Object.keys(preferences).forEach(key => {
      if (preferences[key as keyof typeof preferences]) {
        switch (key) {
          case 'highContrast':
            toggleHighContrast();
            break;
          case 'reducedMotion':
            toggleReducedMotion();
            break;
          case 'largeText':
            toggleLargeText();
            break;
          case 'screenReaderOptimized':
            toggleScreenReaderOptimized();
            break;
        }
      }
    });
    
    // Reset CSS variables
    const root = document.documentElement;
    root.style.removeProperty('--accessibility-font-size');
    root.style.removeProperty('--accessibility-line-height');
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="h-8 w-8 p-0"
        aria-label="Open accessibility settings"
      >
        <Accessibility className="h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <Card className="fixed right-4 top-20 z-50 w-80 shadow-2xl border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Accessibility className="h-5 w-5" />
                Accessibility
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetToDefaults}
                  className="text-xs"
                >
                  Reset
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6 p-6">
              {/* Visual Preferences */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Palette className="h-4 w-4" />
                  Visual Preferences
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="high-contrast" className="text-sm font-medium">
                    High Contrast Mode
                  </Label>
                  <Switch
                    id="high-contrast"
                    checked={preferences.highContrast}
                    onCheckedChange={toggleHighContrast}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="large-text" className="text-sm font-medium">
                    Large Text
                  </Label>
                  <Switch
                    id="large-text"
                    checked={preferences.largeText}
                    onCheckedChange={toggleLargeText}
                  />
                </div>
              </div>

              {/* Motion Preferences */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Zap className="h-4 w-4" />
                  Motion & Animation
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="reduce-motion" className="text-sm font-medium">
                    Reduce Motion
                  </Label>
                  <Switch
                    id="reduce-motion"
                    checked={preferences.reducedMotion}
                    onCheckedChange={toggleReducedMotion}
                  />
                </div>
              </div>

              {/* Typography Controls */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Type className="h-4 w-4" />
                  Typography
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Font Size: {fontSize[0]}%
                    </Label>
                    <Slider
                      value={fontSize}
                      onValueChange={(value) => {
                        setFontSize(value);
                        setTimeout(applyFontSettings, 0);
                      }}
                      max={200}
                      min={75}
                      step={25}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Line Height: {lineHeight[0].toFixed(1)}
                    </Label>
                    <Slider
                      value={lineHeight}
                      onValueChange={(value) => {
                        setLineHeight(value);
                        setTimeout(applyFontSettings, 0);
                      }}
                      max={2.5}
                      min={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Screen Reader Optimization */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="screen-reader" className="text-sm font-medium">
                    Screen Reader Optimized
                  </Label>
                  <Switch
                    id="screen-reader"
                    checked={preferences.screenReaderOptimized}
                    onCheckedChange={toggleScreenReaderOptimized}
                  />
                </div>
              </div>

              {/* Keyboard Shortcuts Help */}
              <div className="pt-4 border-t">
                <div className="text-xs text-muted-foreground space-y-1">
                  <div><kbd className="px-1 py-0.5 text-xs bg-muted rounded">Alt + S</kbd> Skip to content</div>
                  <div><kbd className="px-1 py-0.5 text-xs bg-muted rounded">Alt + N</kbd> Main navigation</div>
                  <div><kbd className="px-1 py-0.5 text-xs bg-muted rounded">Alt + M</kbd> Main content</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
}
