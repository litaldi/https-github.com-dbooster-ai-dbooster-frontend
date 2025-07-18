
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Bot, User, Database, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'query' | 'suggestion';
  metadata?: {
    queryGenerated?: string;
    confidence?: number;
  };
}

export function ConversationalAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI database assistant. I can help you write SQL queries, optimize performance, analyze your database structure, and answer questions about best practices. What would you like to work on today?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateAIResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();
    
    if (input.includes('query') || input.includes('select') || input.includes('sql')) {
      return {
        id: (Date.now() + 1).toString(),
        content: "I can help you with that SQL query! Here's an optimized version that should perform better:",
        sender: 'ai',
        timestamp: new Date(),
        type: 'query',
        metadata: {
          queryGenerated: "SELECT u.id, u.name, u.email, COUNT(o.id) as order_count\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE u.created_at > '2024-01-01'\nGROUP BY u.id, u.name, u.email\nORDER BY order_count DESC\nLIMIT 50;",
          confidence: 92
        }
      };
    }
    
    if (input.includes('optimize') || input.includes('performance') || input.includes('slow')) {
      return {
        id: (Date.now() + 1).toString(),
        content: "For query optimization, I recommend these strategies:\n\n1. Add composite indexes on frequently queried columns\n2. Use LIMIT clauses to reduce result set size\n3. Avoid SELECT * in production queries\n4. Consider query restructuring for complex JOINs\n\nWould you like me to analyze a specific query for you?",
        sender: 'ai',
        timestamp: new Date(),
        type: 'suggestion'
      };
    }
    
    if (input.includes('index') || input.includes('indexing')) {
      return {
        id: (Date.now() + 1).toString(),
        content: "Great question about indexing! Here are some key principles:\n\n• Create indexes on columns used in WHERE clauses\n• Use composite indexes for multi-column searches\n• Be careful with over-indexing (impacts write performance)\n• Monitor index usage with database statistics\n\nDo you have a specific table or query pattern you'd like to optimize?",
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
    }
    
    return {
      id: (Date.now() + 1).toString(),
      content: "I understand you're asking about database optimization. I can help with:\n\n• Writing efficient SQL queries\n• Performance optimization strategies\n• Index recommendations\n• Query analysis and explanation\n• Database design best practices\n\nWhat specific aspect would you like to explore?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          AI Database Assistant
          <Badge variant="secondary" className="ml-auto">
            <Bot className="h-3 w-3 mr-1" />
            Online
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'ai' && (
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              
              <div className={`max-w-[80%] space-y-2 ${message.sender === 'user' ? 'order-1' : ''}`}>
                <div className={`rounded-lg px-4 py-2 ${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  
                  {message.metadata?.queryGenerated && (
                    <div className="mt-3 p-3 bg-background/10 rounded border">
                      <div className="flex items-center gap-2 mb-2">
                        <Code className="h-3 w-3" />
                        <span className="text-xs font-medium">Generated SQL</span>
                        <Badge variant="outline" className="text-xs">
                          {message.metadata.confidence}% confidence
                        </Badge>
                      </div>
                      <pre className="text-xs font-mono overflow-x-auto">
                        {message.metadata.queryGenerated}
                      </pre>
                      <Button size="sm" variant="outline" className="mt-2 h-6 text-xs">
                        Copy Query
                      </Button>
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground px-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              
              {message.sender === 'user' && (
                <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0 order-2">
                  <User className="h-4 w-4" />
                </div>
              )}
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-muted rounded-lg px-4 py-2">
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

        {/* Input Area */}
        <div className="p-4 border-t bg-background/50">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about SQL queries, optimization, or database design..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
