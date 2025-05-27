
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Plus, 
  X,
  Database,
  Filter,
  Sort,
  Play,
  Code
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QueryCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface QuerySort {
  field: string;
  direction: 'ASC' | 'DESC';
}

export function IntelligentQueryBuilder() {
  const { toast } = useToast();
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [conditions, setConditions] = useState<QueryCondition[]>([]);
  const [sorts, setSorts] = useState<QuerySort[]>([]);
  const [generatedQuery, setGeneratedQuery] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);

  // Mock data
  const tables = ['users', 'orders', 'products', 'categories', 'reviews'];
  const tableFields = {
    users: ['id', 'name', 'email', 'created_at', 'status'],
    orders: ['id', 'user_id', 'total', 'status', 'created_at'],
    products: ['id', 'name', 'price', 'category_id', 'stock'],
    categories: ['id', 'name', 'description'],
    reviews: ['id', 'product_id', 'user_id', 'rating', 'comment']
  };

  const operators = [
    { value: '=', label: 'Equals' },
    { value: '!=', label: 'Not equals' },
    { value: '>', label: 'Greater than' },
    { value: '<', label: 'Less than' },
    { value: '>=', label: 'Greater or equal' },
    { value: '<=', label: 'Less or equal' },
    { value: 'LIKE', label: 'Contains' },
    { value: 'IN', label: 'In list' },
    { value: 'IS NULL', label: 'Is null' },
    { value: 'IS NOT NULL', label: 'Is not null' }
  ];

  const addCondition = () => {
    const newCondition: QueryCondition = {
      id: Date.now().toString(),
      field: '',
      operator: '=',
      value: ''
    };
    setConditions([...conditions, newCondition]);
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  const updateCondition = (id: string, field: keyof QueryCondition, value: string) => {
    setConditions(conditions.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const addSort = () => {
    if (!selectedTable) return;
    const fields = tableFields[selectedTable as keyof typeof tableFields] || [];
    const newSort: QuerySort = {
      field: fields[0] || '',
      direction: 'ASC'
    };
    setSorts([...sorts, newSort]);
  };

  const removeSort = (index: number) => {
    setSorts(sorts.filter((_, i) => i !== index));
  };

  const updateSort = (index: number, field: keyof QuerySort, value: string) => {
    setSorts(sorts.map((s, i) => 
      i === index ? { ...s, [field]: value } : s
    ));
  };

  const buildQuery = async () => {
    if (!selectedTable || selectedFields.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select a table and at least one field.",
        variant: "destructive",
      });
      return;
    }

    setIsBuilding(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Build the SQL query
      let query = `SELECT ${selectedFields.join(', ')}\nFROM ${selectedTable}`;

      if (conditions.length > 0) {
        const whereClause = conditions
          .filter(c => c.field && c.value)
          .map(c => {
            if (c.operator === 'LIKE') {
              return `${c.field} LIKE '%${c.value}%'`;
            }
            if (c.operator === 'IN') {
              return `${c.field} IN (${c.value})`;
            }
            if (c.operator === 'IS NULL' || c.operator === 'IS NOT NULL') {
              return `${c.field} ${c.operator}`;
            }
            return `${c.field} ${c.operator} '${c.value}'`;
          })
          .join(' AND ');
        
        if (whereClause) {
          query += `\nWHERE ${whereClause}`;
        }
      }

      if (sorts.length > 0) {
        const orderClause = sorts
          .filter(s => s.field)
          .map(s => `${s.field} ${s.direction}`)
          .join(', ');
        
        if (orderClause) {
          query += `\nORDER BY ${orderClause}`;
        }
      }

      query += ';';

      setGeneratedQuery(query);

      toast({
        title: "Query Built Successfully",
        description: "Your SQL query has been generated.",
      });
    } catch (error) {
      toast({
        title: "Build Failed",
        description: "Unable to build query. Please check your inputs.",
        variant: "destructive",
      });
    } finally {
      setIsBuilding(false);
    }
  };

  const availableFields = selectedTable ? tableFields[selectedTable as keyof typeof tableFields] || [] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Search className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Intelligent Query Builder</h2>
        <Badge variant="outline" className="ml-2">Visual SQL Builder</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Query Builder */}
        <div className="space-y-4">
          {/* Table Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Database className="h-5 w-5" />
                Select Table
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedTable} onValueChange={setSelectedTable}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a table" />
                </SelectTrigger>
                <SelectContent>
                  {tables.map(table => (
                    <SelectItem key={table} value={table}>
                      {table}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Field Selection */}
          {selectedTable && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Fields</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {availableFields.map(field => (
                    <label key={field} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedFields.includes(field)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFields([...selectedFields, field]);
                          } else {
                            setSelectedFields(selectedFields.filter(f => f !== field));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{field}</span>
                    </label>
                  ))}
                </div>
                
                {selectedFields.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex flex-wrap gap-1">
                      {selectedFields.map(field => (
                        <Badge key={field} variant="secondary" className="text-xs">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  WHERE Conditions
                </div>
                <Button size="sm" onClick={addCondition} disabled={!selectedTable}>
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {conditions.map((condition) => (
                <div key={condition.id} className="flex gap-2 items-center">
                  <Select 
                    value={condition.field} 
                    onValueChange={(value) => updateCondition(condition.id, 'field', value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Field" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFields.map(field => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={condition.operator} 
                    onValueChange={(value) => updateCondition(condition.id, 'operator', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {operators.map(op => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {!['IS NULL', 'IS NOT NULL'].includes(condition.operator) && (
                    <Input
                      placeholder="Value"
                      value={condition.value}
                      onChange={(e) => updateCondition(condition.id, 'value', e.target.value)}
                      className="flex-1"
                    />
                  )}
                  
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => removeCondition(condition.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {conditions.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No conditions added. Click + to add filters.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Sorting */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                  <Sort className="h-5 w-5" />
                  ORDER BY
                </div>
                <Button size="sm" onClick={addSort} disabled={!selectedTable}>
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sorts.map((sort, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Select 
                    value={sort.field} 
                    onValueChange={(value) => updateSort(index, 'field', value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Field" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFields.map(field => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={sort.direction} 
                    onValueChange={(value) => updateSort(index, 'direction', value as 'ASC' | 'DESC')}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ASC">ASC</SelectItem>
                      <SelectItem value="DESC">DESC</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => removeSort(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {sorts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No sorting applied. Click + to add ordering.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Generated Query */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Generated Query
            </CardTitle>
            <CardDescription>
              AI-optimized SQL query based on your selections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedQuery ? (
              <>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{generatedQuery}</code>
                </pre>
                
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Play className="mr-2 h-4 w-4" />
                    Execute
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Code className="mr-2 h-4 w-4" />
                    Optimize
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Query Built Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Configure your query parameters and generate SQL.
                </p>
              </div>
            )}
            
            <Button 
              onClick={buildQuery} 
              disabled={!selectedTable || selectedFields.length === 0 || isBuilding}
              className="w-full"
            >
              {isBuilding ? (
                <>
                  <Search className="mr-2 h-4 w-4 animate-spin" />
                  Building Query...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Build Query
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
