
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Database, Table, RefreshCw, FileText, Link } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { nextGenAIService } from '@/services/ai/nextGenAIService';

interface SchemaDesign {
  tables: TableDesign[];
  relationships: string[];
  recommendations: string[];
}

interface TableDesign {
  name: string;
  fields: FieldDefinition[];
  indexes: IndexDefinition[];
}

interface FieldDefinition {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  foreignKey?: string;
}

interface IndexDefinition {
  name: string;
  columns: string[];
  type: 'btree' | 'hash' | 'gin' | 'gist';
  unique: boolean;
}

export function AISchemaDesigner() {
  const [requirements, setRequirements] = useState('');
  const [domain, setDomain] = useState('');
  const [design, setDesign] = useState<SchemaDesign | null>(null);
  const [isDesigning, setIsDesigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSchema = async () => {
    if (!requirements.trim()) return;

    setIsDesigning(true);
    setError(null);

    try {
      await nextGenAIService.initialize();
      const schemaDesign = await nextGenAIService.generateSchemaDesign({
        requirements,
        domain: domain || undefined
      });
      setDesign(schemaDesign);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Schema generation failed');
      console.error('Schema generation failed:', err);
    } finally {
      setIsDesigning(false);
    }
  };

  const getFieldTypeColor = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('varchar') || lowerType.includes('text')) return 'bg-blue-100 text-blue-800';
    if (lowerType.includes('int') || lowerType.includes('number')) return 'bg-green-100 text-green-800';
    if (lowerType.includes('date') || lowerType.includes('time')) return 'bg-purple-100 text-purple-800';
    if (lowerType.includes('bool')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          AI Schema Designer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Requirements</label>
            <Textarea
              placeholder="Describe your project: e.g., 'I need a database for an e-commerce platform with users, products, orders, and reviews'"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Domain (Optional)</label>
            <Textarea
              placeholder="e.g., e-commerce, social media, healthcare, education"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        
        <Button onClick={handleGenerateSchema} disabled={isDesigning || !requirements.trim()}>
          {isDesigning ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Designing Schema...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Generate Schema
            </>
          )}
        </Button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <AnimatePresence>
          {design && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Tables */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Table className="h-5 w-5" />
                  Database Tables
                </h3>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {design.tables.map((table, index) => (
                      <motion.div
                        key={table.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border rounded-lg p-4"
                      >
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Table className="h-4 w-4" />
                          {table.name}
                        </h4>
                        
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">Fields:</h5>
                          <div className="space-y-1">
                            {table.fields.map((field, fieldIndex) => (
                              <div key={fieldIndex} className="flex items-center gap-2 text-sm">
                                <span className="font-mono">{field.name}</span>
                                <Badge className={getFieldTypeColor(field.type)}>
                                  {field.type}
                                </Badge>
                                {field.primaryKey && <Badge variant="outline">PK</Badge>}
                                {field.foreignKey && <Badge variant="outline">FK → {field.foreignKey}</Badge>}
                                {!field.nullable && <Badge variant="secondary">NOT NULL</Badge>}
                              </div>
                            ))}
                          </div>
                        </div>

                        {table.indexes.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <h5 className="text-sm font-medium">Indexes:</h5>
                            <div className="space-y-1">
                              {table.indexes.map((index, indexIndex) => (
                                <div key={indexIndex} className="flex items-center gap-2 text-sm">
                                  <span className="font-mono">{index.name}</span>
                                  <Badge variant="outline">{index.type}</Badge>
                                  {index.unique && <Badge variant="secondary">UNIQUE</Badge>}
                                  <span className="text-muted-foreground">
                                    ({index.columns.join(', ')})
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Relationships */}
              {design.relationships.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Link className="h-5 w-5" />
                    Relationships
                  </h3>
                  <ul className="space-y-1">
                    {design.relationships.map((rel, index) => (
                      <li key={index} className="text-sm flex items-center gap-2">
                        <Link className="h-3 w-3" />
                        {rel}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {design.recommendations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recommendations
                  </h3>
                  <ul className="space-y-1">
                    {design.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
