
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Download, RefreshCw, BookOpen, Database, Link } from 'lucide-react';
import { nextGenAIService } from '@/services/ai/nextGenAIService';

export function DatabaseDocumentationGenerator() {
  const [schema, setSchema] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [documentation, setDocumentation] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  const generateDocumentation = async () => {
    if (!schema.trim()) return;
    
    setIsGenerating(true);
    setProgress(0);
    
    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await nextGenAIService.generateSchemaDesign({
        requirements: `Generate comprehensive documentation for this database schema: ${schema}`,
        domain: 'documentation'
      });
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setDocumentation({
        overview: 'Comprehensive database documentation generated',
        tables: result.tables,
        relationships: result.relationships,
        apiEndpoints: [
          { method: 'GET', endpoint: '/api/users', description: 'Retrieve all users' },
          { method: 'POST', endpoint: '/api/users', description: 'Create new user' },
          { method: 'GET', endpoint: '/api/users/:id', description: 'Get user by ID' }
        ],
        examples: [
          'SELECT * FROM users WHERE active = true',
          'INSERT INTO users (name, email) VALUES (?, ?)',
          'UPDATE users SET last_login = NOW() WHERE id = ?'
        ]
      });
    } catch (error) {
      console.error('Documentation generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            AI-Powered Database Documentation Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Database Schema</label>
            <Textarea
              placeholder="Paste your database schema or describe your database structure..."
              value={schema}
              onChange={(e) => setSchema(e.target.value)}
              rows={6}
              className="font-mono text-sm"
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={generateDocumentation} disabled={isGenerating || !schema.trim()}>
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Documentation
                </>
              )}
            </Button>
            {documentation && (
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            )}
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Generating documentation...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {documentation && (
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Database Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{documentation.overview}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Table Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documentation.tables?.map((table: any, index: number) => (
                  <div key={index} className="border rounded p-3">
                    <h4 className="font-semibold">{table.name}</h4>
                    <div className="mt-2 space-y-1">
                      {table.fields?.map((field: any, fieldIndex: number) => (
                        <div key={fieldIndex} className="flex items-center gap-2 text-sm">
                          <Badge variant="outline">{field.type}</Badge>
                          <span>{field.name}</span>
                          {field.primaryKey && <Badge variant="default">PK</Badge>}
                          {field.foreignKey && <Badge variant="secondary">FK</Badge>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                API Endpoints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {documentation.apiEndpoints?.map((endpoint: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-2 border rounded">
                    <Badge variant={endpoint.method === 'GET' ? 'default' : 'secondary'}>
                      {endpoint.method}
                    </Badge>
                    <code className="text-sm bg-muted px-2 py-1 rounded">{endpoint.endpoint}</code>
                    <span className="text-sm text-muted-foreground">{endpoint.description}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
