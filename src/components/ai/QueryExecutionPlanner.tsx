
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Clock, Cpu, Database, ArrowRight } from 'lucide-react';

export function QueryExecutionPlanner() {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [executionPlan, setExecutionPlan] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState(0);

  const mockExecutionPlans = [
    {
      id: 'current',
      name: 'Current Plan',
      cost: 1250,
      estimatedTime: '2.3s',
      cpuUsage: 85,
      ioOperations: 450,
      steps: [
        { operation: 'Seq Scan', table: 'users', cost: 400, rows: 10000 },
        { operation: 'Hash Join', table: 'orders', cost: 650, rows: 5000 },
        { operation: 'Sort', table: null, cost: 200, rows: 5000 }
      ]
    },
    {
      id: 'optimized',
      name: 'AI Optimized Plan',
      cost: 580,
      estimatedTime: '0.8s',
      cpuUsage: 45,
      ioOperations: 180,
      steps: [
        { operation: 'Index Scan', table: 'users', cost: 120, rows: 2000 },
        { operation: 'Nested Loop', table: 'orders', cost: 360, rows: 2000 },
        { operation: 'Sort', table: null, cost: 100, rows: 2000 }
      ]
    },
    {
      id: 'alternative',
      name: 'Alternative Plan',
      cost: 750,
      estimatedTime: '1.2s',
      cpuUsage: 60,
      ioOperations: 250,
      steps: [
        { operation: 'Bitmap Scan', table: 'users', cost: 200, rows: 3000 },
        { operation: 'Hash Join', table: 'orders', cost: 450, rows: 3000 },
        { operation: 'Limit', table: null, cost: 100, rows: 1000 }
      ]
    }
  ];

  const analyzeQuery = () => {
    if (!query.trim()) return;
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setExecutionPlan(mockExecutionPlans);
      setIsAnalyzing(false);
    }, 1500);
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'current': return 'outline';
      case 'optimized': return 'default';
      case 'alternative': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            AI Query Execution Planner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">SQL Query</label>
            <Textarea
              placeholder="Enter your SQL query to analyze execution plans..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={6}
              className="font-mono text-sm"
            />
          </div>
          
          <Button onClick={analyzeQuery} disabled={isAnalyzing || !query.trim()}>
            {isAnalyzing ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Execution Plans...
              </>
            ) : (
              <>
                <BarChart3 className="h-4 w-4 mr-2" />
                Analyze Execution Plans
              </>
            )}
          </Button>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Generating multiple execution strategies...</div>
              <Progress value={65} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {executionPlan && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Execution Plan Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {executionPlan.map((plan: any, index: number) => (
                  <Card key={plan.id} 
                        className={`cursor-pointer transition-all ${selectedPlan === index ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => setSelectedPlan(index)}>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{plan.name}</h4>
                          <Badge variant={getPlanColor(plan.id)}>
                            {plan.id === 'optimized' ? 'Recommended' : plan.id === 'current' ? 'Current' : 'Alternative'}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Time
                            </span>
                            <span className="font-mono">{plan.estimatedTime}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Cpu className="h-3 w-3" />
                              CPU
                            </span>
                            <span>{plan.cpuUsage}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Database className="h-3 w-3" />
                              Cost
                            </span>
                            <span>{plan.cost}</span>
                          </div>
                        </div>

                        {plan.id === 'optimized' && (
                          <div className="text-xs text-green-600 font-medium">
                            65% faster than current plan
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Execution Steps - {executionPlan[selectedPlan]?.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {executionPlan[selectedPlan]?.steps.map((step: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-white">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{step.operation}</div>
                        {step.table && <div className="text-sm text-muted-foreground">on {step.table}</div>}
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div>Cost: {step.cost}</div>
                      <div className="text-muted-foreground">Rows: {step.rows.toLocaleString()}</div>
                    </div>
                    {index < executionPlan[selectedPlan].steps.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground ml-2" />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex gap-2">
                <Button size="sm">Apply This Plan</Button>
                <Button size="sm" variant="outline">Export Plan</Button>
                <Button size="sm" variant="outline">Compare All Plans</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
