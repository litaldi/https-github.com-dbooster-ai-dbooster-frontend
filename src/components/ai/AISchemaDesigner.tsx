
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Database, Plus, Trash2, Edit, Link } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TableField {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  foreignKey?: string;
}

interface TableDesign {
  name: string;
  fields: TableField[];
  relationships: string[];
}

export function AISchemaDesigner() {
  const [requirement, setRequirement] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [schema, setSchema] = useState<TableDesign[]>([]);

  const generateSchema = async () => {
    if (!requirement.trim()) return;

    setIsGenerating(true);
    
    // Simulate AI schema generation
    setTimeout(() => {
      const mockSchema: TableDesign[] = [
        {
          name: 'users',
          fields: [
            { name: 'id', type: 'UUID', nullable: false, primaryKey: true },
            { name: 'email', type: 'VARCHAR(255)', nullable: false, primaryKey: false },
            { name: 'first_name', type: 'VARCHAR(100)', nullable: false, primaryKey: false },
            { name: 'last_name', type: 'VARCHAR(100)', nullable: false, primaryKey: false },
            { name: 'created_at', type: 'TIMESTAMP', nullable: false, primaryKey: false },
            { name: 'updated_at', type: 'TIMESTAMP', nullable: false, primaryKey: false }
          ],
          relationships: ['Has many orders', 'Has many reviews']
        },
        {
          name: 'products',
          fields: [
            { name: 'id', type: 'UUID', nullable: false, primaryKey: true },
            { name: 'name', type: 'VARCHAR(255)', nullable: false, primaryKey: false },
            { name: 'description', type: 'TEXT', nullable: true, primaryKey: false },
            { name: 'price', type: 'DECIMAL(10,2)', nullable: false, primaryKey: false },
            { name: 'category_id', type: 'UUID', nullable: false, primaryKey: false, foreignKey: 'categories.id' },
            { name: 'created_at', type: 'TIMESTAMP', nullable: false, primaryKey: false }
          ],
          relationships: ['Belongs to category', 'Has many order_items', 'Has many reviews']
        },
        {
          name: 'orders',
          fields: [
            { name: 'id', type: 'UUID', nullable: false, primaryKey: true },
            { name: 'user_id', type: 'UUID', nullable: false, primaryKey: false, foreignKey: 'users.id' },
            { name: 'total_amount', type: 'DECIMAL(10,2)', nullable: false, primaryKey: false },
            { name: 'status', type: 'VARCHAR(50)', nullable: false, primaryKey: false },
            { name: 'created_at', type: 'TIMESTAMP', nullable: false, primaryKey: false }
          ],
          relationships: ['Belongs to user', 'Has many order_items']
        }
      ];
      
      setSchema(mockSchema);
      setIsGenerating(false);
    }, 2000);
  };

  const getFieldIcon = (field: TableField) => {
    if (field.primaryKey) return '🔑';
    if (field.foreignKey) return '🔗';
    return '📝';
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
        <div className="space-y-2">
          <label className="text-sm font-medium">Describe your application requirements</label>
          <Textarea
            placeholder="Example: I need a database for an e-commerce platform with users, products, orders, and reviews"
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            rows={3}
          />
        </div>

        <Button 
          onClick={generateSchema} 
          disabled={isGenerating || !requirement.trim()}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Database className="h-4 w-4 mr-2 animate-pulse" />
              Generating Schema...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Generate Schema
            </>
          )}
        </Button>

        <AnimatePresence>
          {schema.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Generated Database Schema</h4>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {schema.length} tables
                </Badge>
              </div>

              <div className="grid gap-4">
                {schema.map((table, tableIndex) => (
                  <motion.div
                    key={table.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: tableIndex * 0.1 }}
                    className="border rounded-lg p-4 bg-card"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        {table.name}
                      </h5>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h6 className="text-sm font-medium text-muted-foreground">Fields</h6>
                      <div className="space-y-1">
                        {table.fields.map((field, fieldIndex) => (
                          <div
                            key={fieldIndex}
                            className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <span>{getFieldIcon(field)}</span>
                              <span className="font-mono">{field.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {field.type}
                              </Badge>
                              {field.nullable && (
                                <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700">
                                  nullable
                                </Badge>
                              )}
                            </div>
                            {field.foreignKey && (
                              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                                FK: {field.foreignKey}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {table.relationships.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <h6 className="text-sm font-medium text-muted-foreground">Relationships</h6>
                        <div className="flex flex-wrap gap-1">
                          {table.relationships.map((rel, relIndex) => (
                            <Badge
                              key={relIndex}
                              variant="outline"
                              className="text-xs bg-green-50 text-green-700"
                            >
                              <Link className="h-3 w-3 mr-1" />
                              {rel}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Table
                </Button>
                <Button size="sm" variant="outline">
                  Generate SQL
                </Button>
                <Button size="sm" variant="outline">
                  Export Schema
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
