
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Trash2, 
  Play, 
  Save, 
  Download, 
  Copy,
  Database,
  Table,
  Filter,
  SortAsc,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QueryCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  type: 'WHERE' | 'HAVING';
}

interface QueryJoin {
  id: string;
  table: string;
  type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';
  condition: string;
}

interface QueryOrder {
  id: string;
  field: string;
  direction: 'ASC' | 'DESC';
}

export function AdvancedQueryBuilder() {
  const { toast } = useToast();
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [conditions, setConditions] = useState<QueryCondition[]>([]);
  const [joins, setJoins] = useState<QueryJoin[]>([]);
  const [orderBy, setOrderBy] = useState<QueryOrder[]>([]);
  const [groupBy, setGroupBy] = useState<string[]>([]);
  const [limit, setLimit] = useState<string>('');
  const [generatedQuery, setGeneratedQuery] = useState<string>('');

  // Mock data - in real app, this would come from connected databases
  const availableTables = [
    { name: 'users', fields: ['id', 'name', 'email', 'created_at'] },
    { name: 'orders', fields: ['id', 'user_id', 'total', 'status', 'created_at'] },
    { name: 'products', fields: ['id', 'name', 'price', 'category', 'stock'] },
  ];

  const operators = [
    '=', '!=', '>', '<', '>=', '<=', 
    'LIKE', 'NOT LIKE', 'IN', 'NOT IN', 
    'IS NULL', 'IS NOT NULL', 'BETWEEN'
  ];

  const addCondition = useCallback(() => {
    const newCondition: QueryCondition = {
      id: `condition_${Date.now()}`,
      field: '',
      operator: '=',
      value: '',
      type: 'WHERE'
    };
    setConditions(prev => [...prev, newCondition]);
  }, []);

  const removeCondition = useCallback((id: string) => {
    setConditions(prev => prev.filter(c => c.id !== id));
  }, []);

  const updateCondition = useCallback((id: string, updates: Partial<QueryCondition>) => {
    setConditions(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const addJoin = useCallback(() => {
    const newJoin: QueryJoin = {
      id: `join_${Date.now()}`,
      table: '',
      type: 'INNER',
      condition: ''
    };
    setJoins(prev => [...prev, newJoin]);
  }, []);

  const removeJoin = useCallback((id: string) => {
    setJoins(prev => prev.filter(j => j.id !== id));
  }, []);

  const updateJoin = useCallback((id: string, updates: Partial<QueryJoin>) => {
    setJoins(prev => prev.map(j => j.id === id ? { ...j, ...updates } : j));
  }, []);

  const addOrderBy = useCallback(() => {
    const newOrder: QueryOrder = {
      id: `order_${Date.now()}`,
      field: '',
      direction: 'ASC'
    };
    setOrderBy(prev => [...prev, newOrder]);
  }, []);

  const removeOrderBy = useCallback((id: string) => {
    setOrderBy(prev => prev.filter(o => o.id !== id));
  }, []);

  const updateOrderBy = useCallback((id: string, updates: Partial<QueryOrder>) => {
    setOrderBy(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  }, []);

  const generateQuery = useCallback(() => {
    if (selectedTables.length === 0) {
      toast({
        title: "No tables selected",
        description: "Please select at least one table to build a query.",
        variant: "destructive"
      });
      return;
    }

    let query = 'SELECT ';
    
    // SELECT clause
    if (selectedFields.length > 0) {
      query += selectedFields.join(', ');
    } else {
      query += '*';
    }
    
    // FROM clause
    query += `\nFROM ${selectedTables[0]}`;
    
    // JOIN clauses
    joins.forEach(join => {
      if (join.table && join.condition) {
        query += `\n${join.type} JOIN ${join.table} ON ${join.condition}`;
      }
    });
    
    // WHERE clause
    const whereConditions = conditions.filter(c => c.type === 'WHERE' && c.field && c.value);
    if (whereConditions.length > 0) {
      query += '\nWHERE ';
      query += whereConditions.map(c => `${c.field} ${c.operator} '${c.value}'`).join(' AND ');
    }
    
    // GROUP BY clause
    if (groupBy.length > 0) {
      query += `\nGROUP BY ${groupBy.join(', ')}`;
    }
    
    // HAVING clause
    const havingConditions = conditions.filter(c => c.type === 'HAVING' && c.field && c.value);
    if (havingConditions.length > 0) {
      query += '\nHAVING ';
      query += havingConditions.map(c => `${c.field} ${c.operator} '${c.value}'`).join(' AND ');
    }
    
    // ORDER BY clause
    if (orderBy.length > 0) {
      query += '\nORDER BY ';
      query += orderBy.filter(o => o.field).map(o => `${o.field} ${o.direction}`).join(', ');
    }
    
    // LIMIT clause
    if (limit) {
      query += `\nLIMIT ${limit}`;
    }

    setGeneratedQuery(query);
    toast({
      title: "Query generated!",
      description: "Your SQL query has been generated successfully."
    });
  }, [selectedTables, selectedFields, conditions, joins, orderBy, groupBy, limit, toast]);

  const copyQuery = useCallback(() => {
    navigator.clipboard.writeText(generatedQuery);
    toast({
      title: "Query copied!",
      description: "The query has been copied to your clipboard."
    });
  }, [generatedQuery, toast]);

  const executeQuery = useCallback(() => {
    // In a real app, this would execute the query against the database
    toast({
      title: "Query executed!",
      description: "Query executed successfully. Results would appear here in a real implementation."
    });
  }, [toast]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Advanced Query Builder
          </CardTitle>
          <CardDescription>
            Build complex SQL queries visually with an intuitive interface
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Table Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Table className="h-4 w-4" />
              Select Tables
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {availableTables.map(table => (
                <Card 
                  key={table.name}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTables.includes(table.name) ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => {
                    setSelectedTables(prev => 
                      prev.includes(table.name) 
                        ? prev.filter(t => t !== table.name)
                        : [...prev, table.name]
                    );
                  }}
                >
                  <CardContent className="p-3">
                    <div className="font-medium">{table.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {table.fields.join(', ')}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Field Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select Fields (leave empty for SELECT *)</Label>
            <div className="flex flex-wrap gap-2">
              {availableTables
                .filter(table => selectedTables.includes(table.name))
                .flatMap(table => 
                  table.fields.map(field => `${table.name}.${field}`)
                )
                .map(field => (
                  <Badge
                    key={field}
                    variant={selectedFields.includes(field) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedFields(prev =>
                        prev.includes(field)
                          ? prev.filter(f => f !== field)
                          : [...prev, field]
                      );
                    }}
                  >
                    {field}
                  </Badge>
                ))
              }
            </div>
          </div>

          <Separator />

          {/* Joins */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Joins</Label>
              <Button size="sm" variant="outline" onClick={addJoin}>
                <Plus className="h-4 w-4 mr-1" />
                Add Join
              </Button>
            </div>
            {joins.map(join => (
              <div key={join.id} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label className="text-xs">Join Type</Label>
                  <Select value={join.type} onValueChange={value => updateJoin(join.id, { type: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INNER">INNER JOIN</SelectItem>
                      <SelectItem value="LEFT">LEFT JOIN</SelectItem>
                      <SelectItem value="RIGHT">RIGHT JOIN</SelectItem>
                      <SelectItem value="FULL">FULL JOIN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label className="text-xs">Table</Label>
                  <Select value={join.table} onValueChange={value => updateJoin(join.id, { table: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select table" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTables.map(table => (
                        <SelectItem key={table.name} value={table.name}>
                          {table.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-2">
                  <Label className="text-xs">Condition</Label>
                  <Input
                    placeholder="e.g., users.id = orders.user_id"
                    value={join.condition}
                    onChange={e => updateJoin(join.id, { condition: e.target.value })}
                  />
                </div>
                <Button size="sm" variant="outline" onClick={() => removeJoin(join.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Separator />

          {/* Conditions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Conditions
              </Label>
              <Button size="sm" variant="outline" onClick={addCondition}>
                <Plus className="h-4 w-4 mr-1" />
                Add Condition
              </Button>
            </div>
            {conditions.map(condition => (
              <div key={condition.id} className="flex gap-2 items-end">
                <div className="w-24">
                  <Label className="text-xs">Type</Label>
                  <Select value={condition.type} onValueChange={value => updateCondition(condition.id, { type: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WHERE">WHERE</SelectItem>
                      <SelectItem value="HAVING">HAVING</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label className="text-xs">Field</Label>
                  <Input
                    placeholder="field name"
                    value={condition.field}
                    onChange={e => updateCondition(condition.id, { field: e.target.value })}
                  />
                </div>
                <div className="w-24">
                  <Label className="text-xs">Operator</Label>
                  <Select value={condition.operator} onValueChange={value => updateCondition(condition.id, { operator: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {operators.map(op => (
                        <SelectItem key={op} value={op}>{op}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label className="text-xs">Value</Label>
                  <Input
                    placeholder="value"
                    value={condition.value}
                    onChange={e => updateCondition(condition.id, { value: e.target.value })}
                  />
                </div>
                <Button size="sm" variant="outline" onClick={() => removeCondition(condition.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Separator />

          {/* Order By */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium flex items-center gap-2">
                <SortAsc className="h-4 w-4" />
                Order By
              </Label>
              <Button size="sm" variant="outline" onClick={addOrderBy}>
                <Plus className="h-4 w-4 mr-1" />
                Add Order
              </Button>
            </div>
            {orderBy.map(order => (
              <div key={order.id} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label className="text-xs">Field</Label>
                  <Input
                    placeholder="field name"
                    value={order.field}
                    onChange={e => updateOrderBy(order.id, { field: e.target.value })}
                  />
                </div>
                <div className="w-24">
                  <Label className="text-xs">Direction</Label>
                  <Select value={order.direction} onValueChange={value => updateOrderBy(order.id, { direction: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ASC">ASC</SelectItem>
                      <SelectItem value="DESC">DESC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button size="sm" variant="outline" onClick={() => removeOrderBy(order.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Separator />

          {/* Additional Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="groupBy" className="text-sm font-medium">Group By (comma-separated)</Label>
              <Input
                id="groupBy"
                placeholder="field1, field2"
                value={groupBy.join(', ')}
                onChange={e => setGroupBy(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              />
            </div>
            <div>
              <Label htmlFor="limit" className="text-sm font-medium">Limit</Label>
              <Input
                id="limit"
                type="number"
                placeholder="100"
                value={limit}
                onChange={e => setLimit(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={generateQuery} className="flex-1">
              Generate Query
            </Button>
            <Button variant="outline" onClick={copyQuery} disabled={!generatedQuery}>
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            <Button variant="outline" onClick={executeQuery} disabled={!generatedQuery}>
              <Play className="h-4 w-4 mr-1" />
              Execute
            </Button>
            <Button variant="outline" disabled={!generatedQuery}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>

          {/* Generated Query */}
          {generatedQuery && (
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Generated Query
              </Label>
              <ScrollArea className="h-40 w-full border rounded-md">
                <pre className="p-4 text-sm font-mono whitespace-pre-wrap">
                  {generatedQuery}
                </pre>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
