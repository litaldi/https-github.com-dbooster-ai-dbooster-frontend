
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Minimize2, Maximize2, Bot, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'quick-action';
  actions?: Array<{ label: string; action: string }>;
}

interface QuickAction {
  label: string;
  message: string;
  icon?: string;
}

const quickActions: QuickAction[] = [
  { label: '🚀 Try Demo', message: 'I want to try the demo' },
  { label: '💰 Pricing Info', message: 'Tell me about pricing plans' },
  { label: '🔧 How it Works', message: 'How does DBooster work?' },
  { label: '📞 Contact Sales', message: 'I want to speak with sales' },
];

export function AIFloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI assistant for DBooster. I can help you learn about our database optimization features, guide you to the right resources, or connect you with our team. What would you like to know?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
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
        content: getBotResponse(messageText),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('demo') || input.includes('try')) {
      return "Great! You can try our demo right now by clicking the 'Try Demo' button on our homepage or login page. The demo gives you full access to all DBooster features without any limitations. Would you like me to guide you there?";
    }
    
    if (input.includes('pricing') || input.includes('cost') || input.includes('plan')) {
      return "Our pricing is designed to be flexible and affordable. We start at $29/month for small teams, with a free tier for individual developers. Enterprise plans are available for larger organizations. Would you like to see detailed pricing information?";
    }
    
    if (input.includes('how') && (input.includes('work') || input.includes('optimize'))) {
      return "DBooster uses advanced AI to analyze your database queries and performance patterns. It provides specific optimization recommendations that can reduce response times by up to 73%. The process is automated and requires no changes to your existing database setup. Want to learn more about our optimization process?";
    }
    
    if (input.includes('database') || input.includes('support')) {
      return "DBooster supports PostgreSQL, MySQL, SQL Server, and MongoDB. We're continuously adding support for more database systems. Each database type has specialized optimization rules tailored to its unique characteristics. Which database are you using?";
    }
    
    if (input.includes('sales') || input.includes('contact') || input.includes('talk')) {
      return "I'd be happy to connect you with our sales team! You can reach out through our contact page, or I can help schedule a personalized demo. Our team can show you exactly how DBooster can help optimize your specific database setup. Would you prefer to contact them directly or schedule a demo?";
    }
    
    if (input.includes('security') || input.includes('safe')) {
      return "Security is our top priority! DBooster is SOC2 Type II certified and follows industry-leading security practices. We only analyze query structures and metadata - never your actual data. All communications are encrypted, and we offer on-premises deployment for enterprise customers.";
    }
    
    if (input.includes('help') || input.includes('support')) {
      return "I'm here to help! We also have 24/7 support through live chat, comprehensive documentation, and community forums. What specific question do you have about DBooster?";
    }
    
    return "That's a great question! For detailed information, I'd recommend checking our documentation or speaking with our support team. You can also try our demo to see DBooster in action. Is there anything specific about database optimization I can help explain?";
  };

  const handleQuickAction = (action: QuickAction) => {
    handleSendMessage(action.message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <motion.div 
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
          aria-label="Open AI chat assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        <motion.div
          className="absolute -top-2 -right-2"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Badge 
            variant="destructive" 
            className="h-6 w-6 rounded-full p-0 flex items-center justify-center"
          >
            <Sparkles className="h-3 w-3" />
          </Badge>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Card className={cn(
        "w-80 md:w-96 shadow-2xl transition-all duration-300 border-0 bg-background/95 backdrop-blur-sm",
        isMinimized ? "h-16" : "h-[500px]"
      )}>
        <CardHeader className="p-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">AI Assistant</h3>
                <p className="text-xs text-white/80">Online now</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="p-0 flex flex-col h-[436px]">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-2",
                        message.sender === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.sender === 'bot' && (
                        <div className="h-8 w-8 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <div className={cn(
                        "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                        message.sender === 'user' 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      )}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {message.sender === 'user' && (
                        <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-2 justify-start"
                    >
                      <div className="h-8 w-8 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-muted rounded-lg px-3 py-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                {messages.length === 1 && (
                  <div className="px-4 pb-2">
                    <div className="flex flex-wrap gap-2">
                      {quickActions.map((action, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickAction(action)}
                          className="text-xs h-8"
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about DBooster..."
                      className="flex-1 text-sm"
                      disabled={isTyping}
                    />
                    <Button
                      onClick={() => handleSendMessage()}
                      size="sm"
                      disabled={!inputValue.trim() || isTyping}
                      className="h-10 w-10 p-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
