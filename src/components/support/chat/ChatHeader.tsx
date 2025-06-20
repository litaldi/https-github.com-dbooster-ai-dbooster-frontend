
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import { Bot, X, Minimize2, Maximize2 } from 'lucide-react';

interface ChatHeaderProps {
  isMinimized: boolean;
  onToggleMinimize: () => void;
  onClose: () => void;
}

export function ChatHeader({ isMinimized, onToggleMinimize, onClose }: ChatHeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <CardTitle className="text-sm">DBooster Support</CardTitle>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleMinimize}
          className="h-8 w-8 p-0"
        >
          {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
