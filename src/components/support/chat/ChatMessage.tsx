
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex gap-2",
        message.sender === 'user' ? "justify-end" : "justify-start"
      )}
    >
      {message.sender === 'bot' && (
        <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <Bot className="h-3 w-3 text-primary-foreground" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] p-3 rounded-lg text-sm",
          message.sender === 'user'
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        {message.content}
      </div>
      {message.sender === 'user' && (
        <div className="h-6 w-6 bg-muted rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <User className="h-3 w-3" />
        </div>
      )}
    </div>
  );
}
