
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatHeader } from './chat/ChatHeader';
import { ChatMessages } from './chat/ChatMessages';
import { ChatInput } from './chat/ChatInput';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your DBooster assistant. How can I help you optimize your database performance today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('pricing') || input.includes('cost')) {
      return "Our pricing starts at $29/month for small teams. You can view detailed pricing plans on our pricing page. Would you like me to help you find the right plan for your needs?";
    }
    
    if (input.includes('demo') || input.includes('try')) {
      return "Great! You can try our free demo right now - just click 'Try Free Demo' on the homepage. No signup required! Would you like me to guide you through the key features?";
    }
    
    if (input.includes('support') || input.includes('help')) {
      return "I'm here to help! You can also reach our support team at support@dbooster.ai or check our comprehensive documentation. What specific question do you have?";
    }
    
    if (input.includes('database') || input.includes('sql')) {
      return "DBooster supports PostgreSQL, MySQL, and SQL Server with advanced AI-powered optimization. We can analyze your queries and suggest improvements that typically reduce response times by 60-80%. What database are you working with?";
    }
    
    return "Thanks for your message! For detailed assistance, please contact our support team at support@dbooster.ai or check our documentation. Is there anything specific about DBooster I can help explain?";
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center animate-pulse"
        >
          1
        </Badge>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={cn(
        "w-80 shadow-2xl transition-all duration-300",
        isMinimized ? "h-16" : "h-96"
      )}>
        <CardHeader className="p-4">
          <ChatHeader
            isMinimized={isMinimized}
            onToggleMinimize={() => setIsMinimized(!isMinimized)}
            onClose={() => setIsOpen(false)}
          />
        </CardHeader>
        
        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-80">
            <ChatMessages messages={messages} isTyping={isTyping} />
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSendMessage}
            />
          </CardContent>
        )}
      </Card>
    </div>
  );
}
