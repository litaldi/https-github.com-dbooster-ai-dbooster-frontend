
import { useEffect, useState } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useFocusManagement } from '@/hooks/useFocusManagement';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { EnhancedButton } from './enhanced-button';
import { Badge } from './badge';
import { Switch } from './switch';
import { Contrast, Type, Zap, Volume2, Eye, Settings } from 'lucide-react';

export function SkipLink({ href, children = "Skip to main content" }: { href: string; children?: string }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {children}
    </a>
  );
}

interface AccessibilityMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccessibilityMenu({ isOpen, onClose }: AccessibilityMenuProps) {
  const { 
    preferences, 
    toggleHighContrast, 
    toggleReducedMotion, 
    toggleLargeText, 
    toggleScreenReaderOptimized 
  } = useAccessibility();

  const { containerRef } = useFocusManagement(isOpen, {
    trapFocus: true,
    restoreFocus: true
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card 
        ref={containerRef as React.RefObject<HTMLDivElement>}
        className="w-full max-w-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessibility-title"
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle id="accessibility-title" className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Accessibility Settings
            </CardTitle>
            <EnhancedButton
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close accessibility menu"
              className="h-8 w-8 p-0"
            >
              ✕
            </EnhancedButton>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <AccessibilityToggle
              icon={Contrast}
              label="High Contrast"
              description="Increase color contrast for better visibility"
              checked={preferences.highContrast}
              onChange={toggleHighContrast}
            />
            
            <AccessibilityToggle
              icon={Type}
              label="Large Text"
              description="Increase font size throughout the app"
              checked={preferences.largeText}
              onChange={toggleLargeText}
            />
            
            <AccessibilityToggle
              icon={Zap}
              label="Reduced Motion"
              description="Minimize animations and transitions"
              checked={preferences.reducedMotion}
              onChange={toggleReducedMotion}
            />
            
            <AccessibilityToggle
              icon={Volume2}
              label="Screen Reader Mode"
              description="Optimize for screen reader users"
              checked={preferences.screenReaderOptimized}
              onChange={toggleScreenReaderOptimized}
            />
          </div>
          
          <div className="border-t pt-4">
            <p className="text-xs text-muted-foreground">
              These settings are saved locally and will persist across sessions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface AccessibilityToggleProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

function AccessibilityToggle({ icon: Icon, label, description, checked, onChange }: AccessibilityToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3 flex-1">
        <div className="p-2 bg-muted rounded-lg">
          <Icon className="h-4 w-4" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{label}</span>
            {checked && <Badge variant="secondary" className="text-xs">Active</Badge>}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
      
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        aria-label={`Toggle ${label}`}
      />
    </div>
  );
}

export function AccessibilityFloatingButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <EnhancedButton
        onClick={() => setIsMenuOpen(true)}
        className="fixed bottom-4 right-4 z-40 h-12 w-12 rounded-full shadow-lg"
        aria-label="Open accessibility menu"
        variant="default"
        size="icon"
      >
        <Settings className="h-5 w-5" />
      </EnhancedButton>
      
      <AccessibilityMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </>
  );
}

export function KeyboardShortcuts() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setIsVisible(!isVisible);
      }
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  if (!isVisible) return null;

  const shortcuts = [
    { key: '?', description: 'Show keyboard shortcuts' },
    { key: 'Alt + S', description: 'Skip to main content' },
    { key: 'Alt + N', description: 'Focus navigation menu' },
    { key: 'Alt + M', description: 'Focus main content' },
    { key: 'Ctrl + K', description: 'Open command palette' },
    { key: 'Escape', description: 'Close modal or menu' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Keyboard Shortcuts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{shortcut.description}</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {shortcut.key}
                </Badge>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <EnhancedButton 
              variant="outline" 
              onClick={() => setIsVisible(false)}
            >
              Close
            </EnhancedButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
