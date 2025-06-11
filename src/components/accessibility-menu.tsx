
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Accessibility, X } from 'lucide-react';

export function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    reduceMotion: false,
    fontSize: [100],
    lineHeight: [1.5]
  });

  const applySettings = () => {
    const root = document.documentElement;
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add('accessibility-high-contrast');
    } else {
      root.classList.remove('accessibility-high-contrast');
    }

    // Large text
    if (settings.largeText) {
      root.classList.add('accessibility-large-text');
    } else {
      root.classList.remove('accessibility-large-text');
    }

    // Reduce motion
    if (settings.reduceMotion) {
      root.classList.add('accessibility-reduce-motion');
    } else {
      root.classList.remove('accessibility-reduce-motion');
    }

    // Font size
    root.style.setProperty('--accessibility-font-size', `${settings.fontSize[0]}%`);
    
    // Line height
    root.style.setProperty('--accessibility-line-height', settings.lineHeight[0].toString());
  };

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Apply immediately
    setTimeout(applySettings, 0);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="h-8 w-8 p-0"
        aria-label="Open accessibility menu"
      >
        <Accessibility className="h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50" 
            onClick={() => setIsOpen(false)}
          />
          <Card className="fixed right-4 top-20 z-50 w-80 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg">Accessibility</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast" className="text-sm font-medium">
                  High Contrast
                </Label>
                <Switch
                  id="high-contrast"
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="large-text" className="text-sm font-medium">
                  Large Text
                </Label>
                <Switch
                  id="large-text"
                  checked={settings.largeText}
                  onCheckedChange={(checked) => updateSetting('largeText', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="reduce-motion" className="text-sm font-medium">
                  Reduce Motion
                </Label>
                <Switch
                  id="reduce-motion"
                  checked={settings.reduceMotion}
                  onCheckedChange={(checked) => updateSetting('reduceMotion', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Font Size: {settings.fontSize[0]}%
                </Label>
                <Slider
                  value={settings.fontSize}
                  onValueChange={(value) => updateSetting('fontSize', value)}
                  max={200}
                  min={75}
                  step={25}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Line Height: {settings.lineHeight[0]}
                </Label>
                <Slider
                  value={settings.lineHeight}
                  onValueChange={(value) => updateSetting('lineHeight', value)}
                  max={2.5}
                  min={1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
}
