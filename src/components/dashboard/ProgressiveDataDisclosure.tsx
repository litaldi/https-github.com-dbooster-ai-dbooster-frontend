
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronDown, 
  ChevronRight, 
  TrendingUp, 
  Database, 
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface DataLayer {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  data: any;
  children?: DataLayer[];
}

export const samplePerformanceLayers: DataLayer[] = [
  {
    id: 'query-performance',
    title: 'Query Performance',
    description: 'Overall database query optimization metrics',
    icon: Database,
    data: {
      totalQueries: 12847,
      optimizedQueries: 9634,
      avgImprovement: 42.7,
      trend: 'positive'
    },
    children: [
      {
        id: 'slow-queries',
        title: 'Slow Queries',
        description: 'Queries taking longer than 500ms',
        icon: Clock,
        data: {
          count: 23,
          worstQuery: '2.3s',
          recommendations: ['Add index on user_id', 'Optimize JOIN operations']
        }
      },
      {
        id: 'frequent-queries',
        title: 'Most Frequent Queries',
        description: 'Top executed queries by frequency',
        icon: TrendingUp,
        data: {
          topQueries: [
            { query: 'SELECT * FROM users WHERE...', count: 1247 },
            { query: 'UPDATE sessions SET...', count: 892 }
          ]
        }
      }
    ]
  },
  {
    id: 'system-health',
    title: 'System Health',
    description: 'Real-time system status and alerts',
    icon: CheckCircle,
    data: {
      status: 'healthy',
      uptime: 99.97,
      alerts: 0,
      lastCheck: new Date().toISOString()
    }
  }
];

interface ProgressiveDataDisclosureProps {
  title: string;
  description: string;
  layers: DataLayer[];
  initialExpandedLayers?: string[];
}

export function ProgressiveDataDisclosure({
  title,
  description,
  layers,
  initialExpandedLayers = []
}: ProgressiveDataDisclosureProps) {
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(
    new Set(initialExpandedLayers)
  );

  const toggleLayer = (layerId: string) => {
    const newExpanded = new Set(expandedLayers);
    if (newExpanded.has(layerId)) {
      newExpanded.delete(layerId);
    } else {
      newExpanded.add(layerId);
    }
    setExpandedLayers(newExpanded);
  };

  const renderLayer = (layer: DataLayer, depth: number = 0) => {
    const isExpanded = expandedLayers.has(layer.id);
    const Icon = layer.icon;
    const hasChildren = layer.children && layer.children.length > 0;

    return (
      <div key={layer.id} className={`${depth > 0 ? 'ml-6 border-l-2 border-muted pl-4' : ''}`}>
        <Card className="mb-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5" />
                <div>
                  <CardTitle className="text-lg">{layer.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{layer.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {layer.data.trend === 'positive' && (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Improving
                  </Badge>
                )}
                {layer.data.status === 'healthy' && (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Healthy
                  </Badge>
                )}
                {hasChildren && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLayer(layer.id)}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(layer.data).map(([key, value]) => {
                if (key === 'trend' || key === 'status' || typeof value === 'object') return null;
                
                return (
                  <div key={key} className="text-center">
                    <div className="text-2xl font-bold">
                      {typeof value === 'number' && value > 1000 
                        ? value.toLocaleString() 
                        : String(value)
                      }
                    </div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </div>
                  </div>
                );
              })}
            </div>

            {layer.data.recommendations && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Recommendations:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {layer.data.recommendations.map((rec: string, index: number) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {layer.data.uptime && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Uptime</span>
                  <span>{layer.data.uptime}%</span>
                </div>
                <Progress value={layer.data.uptime} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Render children if expanded */}
        {isExpanded && hasChildren && (
          <div className="space-y-2">
            {layer.children!.map(child => renderLayer(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <div className="space-y-4">
        {layers.map(layer => renderLayer(layer))}
      </div>
    </div>
  );
}
