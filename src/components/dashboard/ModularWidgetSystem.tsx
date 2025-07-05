
import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GripVertical, 
  Settings, 
  Eye, 
  EyeOff, 
  Plus,
  Activity,
  Database,
  TrendingUp,
  AlertTriangle,
  Users,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Widget {
  id: string;
  type: 'metric' | 'chart' | 'list' | 'alert';
  title: string;
  component: React.ComponentType<any>;
  props?: any;
  isVisible: boolean;
  size: 'small' | 'medium' | 'large';
}

interface ModularWidgetSystemProps {
  initialWidgets: Widget[];
  onWidgetReorder?: (widgets: Widget[]) => void;
  onWidgetVisibilityToggle?: (widgetId: string, isVisible: boolean) => void;
}

// Sample widget components
const MetricWidget = ({ title, value, trend, icon: Icon }: any) => (
  <Card className="h-full">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{value}</span>
            {trend && (
              <Badge variant={trend > 0 ? "default" : "destructive"} className="text-xs">
                {trend > 0 ? '+' : ''}{trend}%
              </Badge>
            )}
          </div>
        </div>
        {Icon && <Icon className="h-8 w-8 text-muted-foreground" />}
      </div>
    </CardContent>
  </Card>
);

const AlertWidget = ({ alerts }: any) => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle className="text-lg flex items-center gap-2">
        <AlertTriangle className="h-5 w-5" />
        Recent Alerts
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {alerts.map((alert: any, index: number) => (
          <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
            <div className={`w-2 h-2 rounded-full ${
              alert.severity === 'high' ? 'bg-red-500' : 
              alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
            }`} />
            <span className="text-sm">{alert.message}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const ChartWidget = ({ title, data }: any) => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
      <CardDescription>Real-time performance metrics</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-40 flex items-center justify-center bg-muted rounded">
        <TrendingUp className="h-12 w-12 text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Chart Visualization</span>
      </div>
    </CardContent>
  </Card>
);

export function ModularWidgetSystem({ 
  initialWidgets, 
  onWidgetReorder,
  onWidgetVisibilityToggle 
}: ModularWidgetSystemProps) {
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);
  const [isCustomizing, setIsCustomizing] = useState(false);

  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination) return;

    const newWidgets = Array.from(widgets);
    const [reorderedWidget] = newWidgets.splice(result.source.index, 1);
    newWidgets.splice(result.destination.index, 0, reorderedWidget);

    setWidgets(newWidgets);
    onWidgetReorder?.(newWidgets);
  }, [widgets, onWidgetReorder]);

  const toggleWidgetVisibility = useCallback((widgetId: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId 
        ? { ...widget, isVisible: !widget.isVisible }
        : widget
    ));
    
    const widget = widgets.find(w => w.id === widgetId);
    if (widget) {
      onWidgetVisibilityToggle?.(widgetId, !widget.isVisible);
    }
  }, [widgets, onWidgetVisibilityToggle]);

  const getGridCols = (size: string) => {
    switch (size) {
      case 'small': return 'col-span-1';
      case 'medium': return 'col-span-2';
      case 'large': return 'col-span-3';
      default: return 'col-span-1';
    }
  };

  const visibleWidgets = widgets.filter(widget => widget.isVisible);

  return (
    <div className="space-y-6">
      {/* Widget Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">Customize your workspace</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCustomizing(!isCustomizing)}
          >
            <Settings className="h-4 w-4 mr-2" />
            {isCustomizing ? 'Done' : 'Customize'}
          </Button>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Widget
          </Button>
        </div>
      </div>

      {/* Widget Visibility Controls */}
      <AnimatePresence>
        {isCustomizing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-muted p-4 rounded-lg"
          >
            <h3 className="font-medium mb-3">Widget Visibility</h3>
            <div className="flex flex-wrap gap-2">
              {widgets.map(widget => (
                <Button
                  key={widget.id}
                  variant={widget.isVisible ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleWidgetVisibility(widget.id)}
                  className="flex items-center gap-2"
                >
                  {widget.isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  {widget.title}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Widget Grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="widgets">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {visibleWidgets.map((widget, index) => (
                  <Draggable 
                    key={widget.id} 
                    draggableId={widget.id} 
                    index={index}
                    isDragDisabled={!isCustomizing}
                  >
                    {(provided, snapshot) => (
                      <motion.div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`${getGridCols(widget.size)} ${
                          snapshot.isDragging ? 'z-50' : ''
                        }`}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="relative group h-full">
                          {isCustomizing && (
                            <div
                              {...provided.dragHandleProps}
                              className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <GripVertical className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                          <widget.component {...widget.props} />
                        </div>
                      </motion.div>
                    )}
                  </Draggable>
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Empty State */}
      {visibleWidgets.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No widgets visible</h3>
          <p className="text-muted-foreground mb-4">
            Enable some widgets to see your dashboard data
          </p>
          <Button onClick={() => setIsCustomizing(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Customize Dashboard
          </Button>
        </motion.div>
      )}
    </div>
  );
}

// Default widgets configuration
export const defaultWidgets: Widget[] = [
  {
    id: 'performance-score',
    type: 'metric',
    title: 'Performance Score',
    component: MetricWidget,
    props: {
      title: 'Performance Score',
      value: '94/100',
      trend: 12,
      icon: TrendingUp
    },
    isVisible: true,
    size: 'small'
  },
  {
    id: 'active-connections',
    type: 'metric',
    title: 'Active Connections',
    component: MetricWidget,
    props: {
      title: 'Active Connections',
      value: '156',
      trend: -3,
      icon: Users
    },
    isVisible: true,
    size: 'small'
  },
  {
    id: 'response-time',
    type: 'metric',
    title: 'Avg Response Time',
    component: MetricWidget,
    props: {
      title: 'Avg Response Time',
      value: '87ms',
      trend: 8,
      icon: Clock
    },
    isVisible: true,
    size: 'small'
  },
  {
    id: 'performance-chart',
    type: 'chart',
    title: 'Performance Trends',
    component: ChartWidget,
    props: {
      title: 'Performance Trends',
      data: []
    },
    isVisible: true,
    size: 'large'
  },
  {
    id: 'system-alerts',
    type: 'alert',
    title: 'System Alerts',
    component: AlertWidget,
    props: {
      alerts: [
        { severity: 'high', message: 'High memory usage detected' },
        { severity: 'medium', message: 'Slow query identified' },
        { severity: 'low', message: 'Cache optimization available' }
      ]
    },
    isVisible: true,
    size: 'medium'
  }
];
