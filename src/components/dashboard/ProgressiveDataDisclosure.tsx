
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronDown, 
  ChevronRight, 
  Info, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  Activity
} from 'lucide-react';

interface DataLayer {
  id: string;
  title: string;
  summary: string;
  details: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
  isExpanded?: boolean;
}

interface ProgressiveDataDisclosureProps {
  title: string;
  description?: string;
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

  const toggleLayer = useCallback((layerId: string) => {
    setExpandedLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layerId)) {
        newSet.delete(layerId);
      } else {
        newSet.add(layerId);
      }
      return newSet;
    });
  }, []);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandedLayers(new Set(layers.map(l => l.id)))}
          >
            Expand All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandedLayers(new Set())}
          >
            Collapse All
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {layers.map((layer, index) => {
          const isExpanded = expandedLayers.has(layer.id);
          
          return (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className={`border-l-4 ${getPriorityColor(layer.priority)} transition-all duration-200 hover:shadow-md`}>
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => toggleLayer(layer.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </motion.div>
                      {getPriorityIcon(layer.priority)}
                      <div>
                        <CardTitle className="text-base">{layer.title}</CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {layer.summary}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {layer.priority.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="pt-0">
                        <div className="border-t pt-4">
                          {layer.details}
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Sample data layers for database performance
export const samplePerformanceLayers: DataLayer[] = [
  {
    id: 'query-performance',
    title: 'Query Performance Analysis',
    summary: '12 slow queries identified, avg response time: 245ms',
    priority: 'high',
    details: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-red-600">12</div>
            <div className="text-sm text-muted-foreground">Slow Queries</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-yellow-600">245ms</div>
            <div className="text-sm text-muted-foreground">Avg Response</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">87%</div>
            <div className="text-sm text-muted-foreground">Cache Hit Rate</div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Top performing queries show 60% improvement opportunity with index optimization.
        </div>
      </div>
    )
  },
  {
    id: 'resource-utilization',
    title: 'Resource Utilization',
    summary: 'CPU: 45%, Memory: 67%, I/O: 23%',
    priority: 'medium',
    details: (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">CPU Usage</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-muted rounded-full">
              <div className="w-[45%] h-full bg-blue-500 rounded-full"></div>
            </div>
            <span className="text-sm font-medium">45%</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Memory Usage</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-muted rounded-full">
              <div className="w-[67%] h-full bg-yellow-500 rounded-full"></div>
            </div>
            <span className="text-sm font-medium">67%</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">I/O Usage</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-muted rounded-full">
              <div className="w-[23%] h-full bg-green-500 rounded-full"></div>
            </div>
            <span className="text-sm font-medium">23%</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'security-status',
    title: 'Security & Compliance',
    summary: 'All systems secure, last audit: 2 days ago',
    priority: 'low',
    details: (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-sm">SOC2 Type II Compliance Active</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-sm">SSL Certificates Valid</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-sm">Access Controls Verified</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-sm">Audit Logs Current</span>
        </div>
      </div>
    )
  }
];
