
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TestTube, Download, RefreshCw, Database, Users, ShoppingCart } from 'lucide-react';

export function TestDataGenerator() {
  const [schema, setSchema] = useState('');
  const [recordCount, setRecordCount] = useState(1000);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  const mockGeneratedData = {
    tables: [
      {
        name: 'users',
        records: 1000,
        sampleData: [
          { id: 1, name: 'John Doe', email: 'john.doe@example.com', created_at: '2024-01-15' },
          { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', created_at: '2024-01-16' },
          { id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com', created_at: '2024-01-17' }
        ]
      },
      {
        name: 'orders',
        records: 2500,
        sampleData: [
          { id: 1, user_id: 1, total: 99.99, status: 'completed', created_at: '2024-01-15' },
          { id: 2, user_id: 2, total: 149.50, status: 'pending', created_at: '2024-01-16' },
          { id: 3, user_id: 1, total: 79.99, status: 'completed', created_at: '2024-01-17' }
        ]
      }
    ],
    edgeCases: [
      'Users with extremely long names (255 characters)',
      'Orders with zero amounts',
      'Future dates for testing time-based queries',
      'Special characters in email addresses',
      'Maximum and minimum numeric values'
    ],
    stressTests: [
      'Bulk insert of 100,000 records',
      'Concurrent user scenarios',
      'Database constraint violations',
      'Memory-intensive queries'
    ]
  };

  const generateTestData = () => {
    if (!schema.trim()) return;
    
    setIsGenerating(true);
    setProgress(0);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      setGeneratedData(mockGeneratedData);
      setProgress(100);
      setIsGenerating(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-primary" />
            AI-Driven Test Data Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Database Schema</label>
              <Textarea
                placeholder="Paste your table definitions or schema..."
                value={schema}
                onChange={(e) => setSchema(e.target.value)}
                rows={6}
                className="font-mono text-sm"
              />
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Records</label>
                <Input
                  type="number"
                  value={recordCount}
                  onChange={(e) => setRecordCount(Number(e.target.value))}
                  min={10}
                  max={100000}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Types</label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Realistic Names</Badge>
                  <Badge variant="outline">Valid Emails</Badge>
                  <Badge variant="outline">Edge Cases</Badge>
                  <Badge variant="outline">Referential Integrity</Badge>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={generateTestData} disabled={isGenerating || !schema.trim()}>
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4 mr-2" />
                  Generate Test Data
                </>
              )}
            </Button>
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Generating realistic test data...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {generatedData && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Generated Test Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generatedData.tables.map((table: any, index: number) => (
                  <div key={index} className="border rounded p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        {table.name === 'users' ? <Users className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                        {table.name}
                      </h4>
                      <Badge>{table.records.toLocaleString()} records</Badge>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="border-b">
                            {Object.keys(table.sampleData[0]).map((key) => (
                              <th key={key} className="text-left p-2 font-medium">{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {table.sampleData.map((row: any, rowIndex: number) => (
                            <tr key={rowIndex} className="border-b">
                              {Object.values(row).map((value: any, cellIndex: number) => (
                                <td key={cellIndex} className="p-2">{value}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Export SQL
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Export CSV
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Edge Cases Generated</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedData.edgeCases.map((edgeCase: string, index: number) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      {edgeCase}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stress Test Scenarios</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedData.stressTests.map((test: string, index: number) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      {test}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
