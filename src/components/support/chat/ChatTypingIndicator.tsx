
import { Bot } from 'lucide-react';

export function ChatTypingIndicator() {
  return (
    <div className="flex gap-2 justify-start">
      <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
        <Bot className="h-3 w-3 text-primary-foreground" />
      </div>
      <div className="bg-muted p-3 rounded-lg">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}
