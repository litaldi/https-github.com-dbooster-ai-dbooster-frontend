
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Copy, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Camera, 
  Image, 
  Code,
  Sparkles,
  Brain,
  Zap
} from 'lucide-react';
import { advancedChatService, type ChatMessage, type ChatResponse } from '@/services/ai/advancedChatService';
import { voiceInterfaceService, type SpeechRecognitionResult } from '@/services/ai/voiceInterfaceService';
import { visualAIService, type VisualAnalysisResult } from '@/services/ai/visualAIService';
import { toast } from 'sonner';

export function EnhancedAIChatAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your enhanced AI database assistant. I can help you with SQL queries, voice commands, visual analysis, and much more. What would you like to work on today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Check if API key exists
    const storedApiKey = localStorage.getItem('openai_api_key');
    if (!storedApiKey) {
      setShowApiKeyInput(true);
    } else {
      setApiKey(storedApiKey);
      initializeServices(storedApiKey);
    }
  }, []);

  const initializeServices = async (key: string) => {
    try {
      await advancedChatService.initialize(key);
      await visualAIService.initialize(key);
      toast.success('AI services initialized successfully!');
    } catch (error) {
      toast.error('Failed to initialize AI services');
      setShowApiKeyInput(true);
    }
  };

  const handleApiKeySubmit = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }

    try {
      await initializeServices(apiKey);
      setShowApiKeyInput(false);
      advancedChatService.setApiKey(apiKey);
      visualAIService.setApiKey(apiKey);
    } catch (error) {
      toast.error('Invalid API key or connection failed');
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsProcessing(true);

    try {
      const response: ChatResponse = await advancedChatService.chatWithContext(inputMessage);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        metadata: {
          sqlCode: response.sqlCode,
          confidence: response.confidence,
          queryGenerated: response.sqlCode
        }
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Auto-speak the response if TTS is enabled
      if (isSpeaking) {
        await voiceInterfaceService.speak(response.content);
      }

    } catch (error) {
      console.error('Chat failed:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble processing your request. Please check your API key and try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleVoiceListening = async () => {
    if (isListening) {
      voiceInterfaceService.stopListening();
      setIsListening(false);
    } else {
      try {
        await voiceInterfaceService.startListening(
          (result: SpeechRecognitionResult) => {
            if (result.isFinal) {
              setInputMessage(result.transcript);
              setIsListening(false);
              // Auto-send voice commands
              setTimeout(() => handleSendMessage(), 500);
            }
          },
          (error: string) => {
            toast.error(`Voice recognition error: ${error}`);
            setIsListening(false);
          }
        );
        setIsListening(true);
        toast.success('Listening... Speak your query now');
      } catch (error) {
        toast.error('Voice recognition not available');
      }
    }
  };

  const toggleTextToSpeech = () => {
    if (isSpeaking) {
      voiceInterfaceService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      toast.success('Text-to-speech enabled');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target?.result as string;
        
        setIsProcessing(true);
        
        try {
          const analysis: VisualAnalysisResult = await visualAIService.analyzeScreenshot({
            imageData,
            analysisType: 'general',
            context: 'Database-related image analysis'
          });

          const analysisMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'assistant',
            content: `Image Analysis Results:\n\n${analysis.description}\n\nRecommendations:\n${analysis.recommendations.join('\n')}`,
            timestamp: new Date(),
            metadata: {
              sqlCode: analysis.suggestedSQL,
              confidence: analysis.confidence
            }
          };

          setMessages(prev => [...prev, analysisMessage]);
          toast.success('Image analyzed successfully!');
        } catch (error) {
          toast.error('Failed to analyze image');
        } finally {
          setIsProcessing(false);
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Failed to process image');
    }
  };

  const captureScreenshot = async () => {
    try {
      setIsProcessing(true);
      const screenshot = await visualAIService.captureScreenshot();
      
      const analysis: VisualAnalysisResult = await visualAIService.analyzeScreenshot({
        imageData: screenshot,
        analysisType: 'general',
        context: 'Screen capture analysis for database insights'
      });

      const analysisMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Screenshot Analysis:\n\n${analysis.description}\n\nSuggestions:\n${analysis.recommendations.join('\n')}`,
        timestamp: new Date(),
        metadata: {
          sqlCode: analysis.suggestedSQL,
          confidence: analysis.confidence
        }
      };

      setMessages(prev => [...prev, analysisMessage]);
      toast.success('Screenshot captured and analyzed!');
    } catch (error) {
      toast.error('Failed to capture screenshot');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  if (showApiKeyInput) {
    return (
      <Card className="h-[600px] flex flex-col items-center justify-center">
        <CardContent className="text-center space-y-4">
          <Brain className="h-12 w-12 text-primary mx-auto" />
          <h3 className="text-lg font-semibold">AI Services Setup</h3>
          <p className="text-muted-foreground">
            Enter your OpenAI API key to enable advanced AI features
          </p>
          <div className="flex gap-2 max-w-md">
            <Input
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleApiKeySubmit()}
            />
            <Button onClick={handleApiKeySubmit}>
              <Zap className="h-4 w-4 mr-2" />
              Connect
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[700px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Enhanced AI Assistant
          <Badge variant="secondary" className="ml-auto">
            <Brain className="h-3 w-3 mr-1" />
            GPT-4 Powered
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="voice">Voice</TabsTrigger>
            <TabsTrigger value="visual">Visual AI</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-1 flex flex-col space-y-4">
            <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      )}
                      
                      <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
                        <div className={`p-3 rounded-lg ${
                          message.role === 'user' 
                            ? 'bg-primary text-white' 
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          
                          {message.metadata?.confidence && (
                            <Badge variant="outline" className="mt-2">
                              {Math.round(message.metadata.confidence * 100)}% confidence
                            </Badge>
                          )}
                        </div>
                        
                        {message.metadata?.sqlCode && (
                          <div className="mt-2 p-3 bg-gray-900 text-green-400 rounded-lg font-mono text-xs relative group">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => copyToClipboard(message.metadata.sqlCode!)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <pre className="whitespace-pre-wrap">{message.metadata.sqlCode}</pre>
                          </div>
                        )}
                        
                        <p className="text-xs text-muted-foreground mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      
                      {message.role === 'user' && (
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>
            
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything about databases, SQL, or optimization..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isProcessing}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={isProcessing || !inputMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="voice" className="flex-1 flex flex-col items-center justify-center space-y-6">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto">
                {isListening ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Mic className="h-12 w-12 text-white" />
                  </motion.div>
                ) : (
                  <MicOff className="h-12 w-12 text-white" />
                )}
              </div>
              
              <h3 className="text-lg font-semibold">Voice Interface</h3>
              <p className="text-muted-foreground max-w-md">
                Use voice commands to interact with your database. Say things like "Show all users" or "Create a new table".
              </p>
              
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={toggleVoiceListening}
                  variant={isListening ? "destructive" : "default"}
                  size="lg"
                >
                  {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                  {isListening ? 'Stop Listening' : 'Start Listening'}
                </Button>
                
                <Button
                  onClick={toggleTextToSpeech}
                  variant={isSpeaking ? "default" : "outline"}
                  size="lg"
                >
                  {isSpeaking ? <Volume2 className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
                  TTS {isSpeaking ? 'On' : 'Off'}
                </Button>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Voice Command Examples:</h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {voiceInterfaceService.getVoiceCommandSuggestions().slice(0, 4).map((suggestion, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      "{suggestion}"
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="visual" className="flex-1 flex flex-col items-center justify-center space-y-6">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto">
                <Camera className="h-12 w-12 text-white" />
              </div>
              
              <h3 className="text-lg font-semibold">Visual AI Analysis</h3>
              <p className="text-muted-foreground max-w-md">
                Upload images of database tables, diagrams, or queries for AI-powered analysis and SQL generation.
              </p>
              
              <div className="flex gap-4 justify-center">
                <Button onClick={() => fileInputRef.current?.click()} size="lg">
                  <Image className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                
                <Button onClick={captureScreenshot} variant="outline" size="lg">
                  <Camera className="h-4 w-4 mr-2" />
                  Screenshot
                </Button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Supported Analysis Types:</h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline">Database Tables</Badge>
                  <Badge variant="outline">SQL Queries</Badge>
                  <Badge variant="outline">ER Diagrams</Badge>
                  <Badge variant="outline">Schema Designs</Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
