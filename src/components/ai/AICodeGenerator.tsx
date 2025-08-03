
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Code2, Wand2, Copy, Download, Eye, Settings } from 'lucide-react';
import { nextGenAIService } from '@/services/ai/nextGenAIService';
import { productionLogger } from '@/utils/productionLogger';

interface GeneratedCode {
  type: string;
  language: string;
  code: string;
  explanation: string;
  dependencies: string[];
  testCases?: string;
}

export function AICodeGenerator() {
  const [description, setDescription] = useState('');
  const [codeType, setCodeType] = useState('crud');
  const [targetLanguage, setTargetLanguage] = useState('typescript');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [activeTab, setActiveTab] = useState('description');

  const generateCode = async () => {
    if (!description.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // Mock implementation - in real app, this would call the AI service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockCode: GeneratedCode = {
        type: codeType,
        language: targetLanguage,
        code: getExampleCode(codeType, targetLanguage),
        explanation: getExampleExplanation(codeType),
        dependencies: getExampleDependencies(codeType, targetLanguage),
        testCases: getExampleTests(codeType, targetLanguage)
      };
      
      setGeneratedCode(mockCode);
      setActiveTab('code');
    } catch (error) {
      productionLogger.error('Code generation failed', error, 'AICodeGenerator');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getExampleCode = (type: string, language: string) => {
    if (type === 'crud' && language === 'typescript') {
      return `// Generated CRUD operations for User entity
import { supabase } from '@/lib/supabase';

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export class UserService {
  // Create a new user
  static async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Get user by ID
  static async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }

  // Update user
  static async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Delete user
  static async deleteUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // List users with pagination
  static async listUsers(page = 0, limit = 10): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .range(page * limit, (page + 1) * limit - 1)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
}`;
    }
    return '// Generated code will appear here...';
  };

  const getExampleExplanation = (type: string) => {
    if (type === 'crud') {
      return `This generated code provides a complete CRUD (Create, Read, Update, Delete) service for managing users. It includes:

1. **Type Safety**: Full TypeScript interfaces for type checking
2. **Error Handling**: Proper error handling for all database operations
3. **Pagination**: Built-in pagination support for listing operations
4. **Single Responsibility**: Each method handles one specific operation
5. **Supabase Integration**: Optimized for Supabase database operations

The service can be easily extended with additional methods like search, filtering, or bulk operations.`;
    }
    return 'Code explanation will appear here...';
  };

  const getExampleDependencies = (type: string, language: string) => {
    if (type === 'crud' && language === 'typescript') {
      return ['@supabase/supabase-js', '@types/node'];
    }
    return [];
  };

  const getExampleTests = (type: string, language: string) => {
    if (type === 'crud' && language === 'typescript') {
      return `// Generated test cases
import { UserService } from './UserService';

describe('UserService', () => {
  test('should create a new user', async () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User'
    };
    
    const user = await UserService.createUser(userData);
    
    expect(user).toBeDefined();
    expect(user.email).toBe(userData.email);
    expect(user.name).toBe(userData.name);
  });

  test('should get user by ID', async () => {
    const userId = 'test-user-id';
    const user = await UserService.getUserById(userId);
    
    expect(user).toBeDefined();
    expect(user?.id).toBe(userId);
  });

  test('should update user', async () => {
    const userId = 'test-user-id';
    const updates = { name: 'Updated Name' };
    
    const updatedUser = await UserService.updateUser(userId, updates);
    
    expect(updatedUser.name).toBe(updates.name);
  });

  test('should delete user', async () => {
    const userId = 'test-user-id';
    
    await expect(UserService.deleteUser(userId)).resolves.not.toThrow();
  });

  test('should list users with pagination', async () => {
    const users = await UserService.listUsers(0, 5);
    
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeLessThanOrEqual(5);
  });
});`;
    }
    return '// Test cases will be generated here...';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            AI Code Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="code">Generated Code</TabsTrigger>
              <TabsTrigger value="tests">Test Cases</TabsTrigger>
              <TabsTrigger value="explanation">Explanation</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Code Type</label>
                  <Select value={codeType} onValueChange={setCodeType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="crud">CRUD Operations</SelectItem>
                      <SelectItem value="api">REST API Endpoints</SelectItem>
                      <SelectItem value="component">React Component</SelectItem>
                      <SelectItem value="service">Service Class</SelectItem>
                      <SelectItem value="middleware">Middleware</SelectItem>
                      <SelectItem value="validation">Validation Schema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Language</label>
                  <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="sql">SQL</SelectItem>
                      <SelectItem value="go">Go</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Describe what you want to generate. For example: 'Create a user management service with CRUD operations for a social media app'"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                />
              </div>

              <Button 
                onClick={generateCode} 
                disabled={isGenerating || !description.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Settings className="h-4 w-4 mr-2 animate-spin" />
                    Generating Code...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate Code
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="code" className="space-y-4">
              {generatedCode ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge>{generatedCode.language}</Badge>
                      <Badge variant="outline">{generatedCode.type}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(generatedCode.code)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      <code>{generatedCode.code}</code>
                    </pre>
                  </div>

                  {generatedCode.dependencies.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Dependencies</h3>
                      <div className="flex flex-wrap gap-2">
                        {generatedCode.dependencies.map((dep, index) => (
                          <Badge key={index} variant="secondary">{dep}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Alert>
                  <Eye className="h-4 w-4" />
                  <AlertDescription>
                    Generated code will appear here after you provide a description and click "Generate Code".
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="tests" className="space-y-4">
              {generatedCode?.testCases ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Generated Test Cases</h3>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(generatedCode.testCases!)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Tests
                    </Button>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      <code>{generatedCode.testCases}</code>
                    </pre>
                  </div>
                </div>
              ) : (
                <Alert>
                  <Eye className="h-4 w-4" />
                  <AlertDescription>
                    Test cases will be generated along with your code.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="explanation" className="space-y-4">
              {generatedCode ? (
                <div className="space-y-4">
                  <h3 className="font-medium">Code Explanation</h3>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm whitespace-pre-line">{generatedCode.explanation}</p>
                  </div>
                </div>
              ) : (
                <Alert>
                  <Eye className="h-4 w-4" />
                  <AlertDescription>
                    Detailed explanation will be provided with the generated code.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
