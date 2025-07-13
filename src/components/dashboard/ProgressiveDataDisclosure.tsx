
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronRight, 
  BarChart3, 
  Database, 
  Activity,
  TrendingUp
} from 'lucide-react';

interface DataLayer {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  data: Record<string, any>;
  isExpanded?: boolean;
}

export const samplePerformanceLayers: DataLayer[] = [
  {
    id: 'query-performance',
    title: 'Query Performance',
    description: 'Detailed analysis of database query execution times',
    icon: BarChart3,
    data: {
      averageResponseTime: '127ms',
      slowQueries: 12,
      optimizedQueries: 847,
      cacheHitRatio: '94.2%',
    },
    isExpanded: true,
  },
  {
    id: 'connection-metrics',
    title: 'Connection Metrics',
    description: 'Database connection pool and usage statistics',
    icon: Database,
    data: {
      activeConnections: 156,
      maxConnections: 500,
      poolUtilization: '31.2%',
      connectionErrors: 0,
    },
  },
  {
    id: 'system-resources',
    title: 'System Resources',
    description: 'CPU, memory, and storage utilization metrics',
    icon: Activity,
    data: {
      cpuUsage: '23.5%',
      memoryUsage: '67.8%',
      diskUsage: '45.2%',
      networkIO: '2.3MB/s',
    },
  },
  {
    id: 'optimization-opportunities',
    title: 'Optimization Opportunities',
    description: 'AI-identified areas for performance improvements',
    icon: TrendingUp,
    data: {
      indexSuggestions: 5,
      queryOptimizations: 12,
      estimatedSavings: '15-25%',
      priority: 'Medium',
    },
  },
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
  initialExpandedLayers = [],
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {layers.map((layer) => {
          const isExpanded = expandedLayers.has(layer.id);
          return (
            <Collapsible
              key={layer.id}
              open={isExpanded}
              onOpenChange={() => toggleLayer(layer.id)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    <layer.icon className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">{layer.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {layer.description}
                      </div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                  {Object.entries(layer.data).map(([key, value]) => (
                    <div key={key} className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-semibold">{value}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </CardContent>
    </Card>
  );
}
