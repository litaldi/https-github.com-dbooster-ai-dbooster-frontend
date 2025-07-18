
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Database, Filter, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QueryCondition {
  column: string;
  operator: string;
  value: string;
  connector: 'AND' | 'OR';
}

interface QueryJoin {
  table: string;
  type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';
  on: string;
}

interface VisualQuery {
  select: string[];
  from: string;
  joins: QueryJoin[];
  where: QueryCondition[];
  orderBy: string[];
  limit?: number;
}

export function VisualQueryBuilder() {
  const [query, setQuery] = useState<VisualQuery>({
    select: ['*'],
    from: '',
    joins: [],
    where: [],
    orderBy: []
  });

  const [generatedSQL, setGeneratedSQL] = useState('');

  const generateSQL = () => {
    let sql = 'SELECT ';
    sql += query.select.join(', ');
    
    if (query.from) {
      sql += `\nFROM ${query.from}`;
    }
    
    query.joins.forEach(join => {
      sql += `\n${join.type} JOIN ${join.table} ON ${join.on}`;
    });
    
    if (query.where.length > 0) {
      sql += '\nWHERE ';
      query.where.forEach((condition, index) => {
        if (index > 0) {
          sql += ` ${condition.connector} `;
        }
        sql += `${condition.column} ${condition.operator} '${condition.value}'`;
      });
    }
    
    if (query.orderBy.length > 0) {
      sql += `\nORDER BY ${query.orderBy.join(', ')}`;
    }
    
    if (query.limit) {
      sql += `\nLIMIT ${query.limit}`;
    }
    
    setGeneratedSQL(sql);
  };

  const addCondition = () => {
    setQuery(prev => ({
      ...prev,
      where: [...prev.where, { column: '', operator: '=', value: '', connector: 'AND' }]
    }));
  };

  const addJoin = () => {
    setQuery(prev => ({
      ...prev,
      joins: [...prev.joins, { table: '', type: 'INNER', on: '' }]
    }));
  };

  const removeCondition = (index: number) => {
    setQuery(prev => ({
      ...prev,
      where: prev.where.filter((_, i) => i !== index)
    }));
  };

  const removeJoin = (index: number) => {
    setQuery(prev => ({
      ...prev,
      joins: prev.joins.filter((_, i) => i !== index)
    }));
  };

  const updateCondition = (index: number, field: keyof QueryCondition, value: string) => {
    setQuery(prev => ({
      ...prev,
      where: prev.where.map((condition, i) => 
        i === index ? { ...condition, [field]: value } : condition
      )
    }));
  };

  const updateJoin = (index: number, field: keyof QueryJoin, value: string) => {
    setQuery(prev => ({
      ...prev,
      joins: prev.joins.map((join, i) => 
        i === index ? { ...join, [field]: value } : join
      )
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Visual Query Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* SELECT */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Columns</label>
            <div className="flex gap-2">
              <Input
                placeholder="column1, column2, *"
                value={query.select.join(', ')}
                onChange={(e) => setQuery(prev => ({
                  ...prev,
                  select: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                }))}
              />
            </div>
          </div>

          {/* FROM */}
          <div className="space-y-2">
            <label className="text-sm font-medium">From Table</label>
            <Input
              placeholder="table_name"
              value={query.from}
              onChange={(e) => setQuery(prev => ({ ...prev, from: e.target.value }))}
            />
          </div>

          {/* JOINS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Joins</label>
              <Button size="sm" variant="outline" onClick={addJoin}>
                <Plus className="h-3 w-3 mr-1" />
                Add Join
              </Button>
            </div>
            <AnimatePresence>
              {query.joins.map((join, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex gap-2 items-center p-3 border rounded-lg"
                >
                  <Select
                    value={join.type}
                    onValueChange={(value) => updateJoin(index, 'type', value)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INNER">INNER</SelectItem>
                      <SelectItem value="LEFT">LEFT</SelectItem>
                      <SelectItem value="RIGHT">RIGHT</SelectItem>
                      <SelectItem value="FULL">FULL</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    placeholder="table_name"
                    value={join.table}
                    onChange={(e) => updateJoin(index, 'table', e.target.value)}
                    className="flex-1"
                  />
                  
                  <span className="text-sm text-muted-foreground">ON</span>
                  
                  <Input
                    placeholder="table1.id = table2.foreign_id"
                    value={join.on}
                    onChange={(e) => updateJoin(index, 'on', e.target.value)}
                    className="flex-1"
                  />
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeJoin(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* WHERE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Where Conditions
              </label>
              <Button size="sm" variant="outline" onClick={addCondition}>
                <Plus className="h-3 w-3 mr-1" />
                Add Condition
              </Button>
            </div>
            <AnimatePresence>
              {query.where.map((condition, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex gap-2 items-center p-3 border rounded-lg"
                >
                  {index > 0 && (
                    <Select
                      value={condition.connector}
                      onValueChange={(value) => updateCondition(index, 'connector', value)}
                    >
                      <SelectTrigger className="w-16">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AND">AND</SelectItem>
                        <SelectItem value="OR">OR</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  
                  <Input
                    placeholder="column"
                    value={condition.column}
                    onChange={(e) => updateCondition(index, 'column', e.target.value)}
                  />
                  
                  <Select
                    value={condition.operator}
                    onValueChange={(value) => updateCondition(index, 'operator', value)}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="=">=</SelectItem>
                      <SelectItem value="!=">!=</SelectItem>
                      <SelectItem value="<">&lt;</SelectItem>
                      <SelectItem value=">">&gt;</SelectItem>
                      <SelectItem value="<=">≤</SelectItem>
                      <SelectItem value=">=">≥</SelectItem>
                      <SelectItem value="LIKE">LIKE</SelectItem>
                      <SelectItem value="IN">IN</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    placeholder="value"
                    value={condition.value}
                    onChange={(e) => updateCondition(index, 'value', e.target.value)}
                  />
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeCondition(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ORDER BY & LIMIT */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Order By
              </label>
              <Input
                placeholder="column1 ASC, column2 DESC"
                value={query.orderBy.join(', ')}
                onChange={(e) => setQuery(prev => ({
                  ...prev,
                  orderBy: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Limit</label>
              <Input
                type="number"
                placeholder="100"
                value={query.limit || ''}
                onChange={(e) => setQuery(prev => ({
                  ...prev,
                  limit: e.target.value ? parseInt(e.target.value) : undefined
                }))}
              />
            </div>
          </div>

          <Button onClick={generateSQL} className="w-full">
            Generate SQL Query
          </Button>
        </CardContent>
      </Card>

      {generatedSQL && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Generated SQL</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg text-sm font-mono whitespace-pre-wrap">
              {generatedSQL}
            </pre>
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline">
                Copy Query
              </Button>
              <Button size="sm" variant="outline">
                Execute Query
              </Button>
              <Button size="sm" variant="outline">
                Save Query
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
