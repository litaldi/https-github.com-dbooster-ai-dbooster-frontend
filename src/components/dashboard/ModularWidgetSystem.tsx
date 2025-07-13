
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  GripVertical, 
  Settings, 
  Eye, 
  EyeOff,
  BarChart3,
  Database,
  Shield,
  Activity
} from 'lucide-react';

interface Widget {
  id: string;
  title: string;
  type: 'chart' | 'metric' | 'status' | 'list';
  icon: React.ComponentType<any>;
  isVisible: boolean;
  order: number;
}

export const defaultWidgets: Widget[] = [
  {
    id: 'performance-chart',
    title: 'Performance Chart',
    type: 'chart',
    icon: BarChart3,
    isVisible: true,
    order: 1
  },
  {
    id: 'query-metrics',
    title: 'Query Metrics',
    type: 'metric',
    icon: Database,
    isVisible: true,
    order: 2
  },
  {
    id: 'security-status',
    title: 'Security Status',
    type: 'status',
    icon: Shield,
    isVisible: true,
    order: 3
  },
  {
    id: 'system-health',
    title: 'System Health',
    type: 'status',
    icon: Activity,
    isVisible: false,
    order: 4
  }
];

interface ModularWidgetSystemProps {
  initialWidgets: Widget[];
  onWidgetReorder: (widgets: Widget[]) => void;
  onWidgetVisibilityToggle: (widgetId: string, isVisible: boolean) => void;
}

export function ModularWidgetSystem({
  initialWidgets,
  onWidgetReorder,
  onWidgetVisibilityToggle
}: ModularWidgetSystemProps) {
  const [widgets, setWidgets] = useState(initialWidgets);
  const [isConfigMode, setIsConfigMode] = useState(false);

  const handleVisibilityToggle = (widgetId: string) => {
    const updatedWidgets = widgets.map(widget =>
      widget.id === widgetId
        ? { ...widget, isVisible: !widget.isVisible }
        : widget
    );
    setWidgets(updatedWidgets);
    onWidgetVisibilityToggle(widgetId, !widgets.find(w => w.id === widgetId)?.isVisible);
  };

  const visibleWidgets = widgets.filter(widget => widget.isVisible);

  return (
    <div className="space-y-6">
      {/* Widget Configuration Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard Widgets</h2>
          <p className="text-muted-foreground">
            Customize your dashboard layout and visibility
          </p>
        </div>
        <Button
          variant={isConfigMode ? 'default' : 'outline'}
          onClick={() => setIsConfigMode(!isConfigMode)}
        >
          <Settings className="h-4 w-4 mr-2" />
          {isConfigMode ? 'Done' : 'Configure'}
        </Button>
      </div>

      {/* Configuration Panel */}
      {isConfigMode && (
        <Card>
          <CardHeader>
            <CardTitle>Widget Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {widgets.map((widget) => {
                const Icon = widget.icon;
                return (
                  <div
                    key={widget.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                      <Icon className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{widget.title}</div>
                        <div className="text-sm text-muted-foreground">
                          Type: {widget.type}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={widget.isVisible ? 'default' : 'secondary'}>
                        {widget.isVisible ? 'Visible' : 'Hidden'}
                      </Badge>
                      <Switch
                        checked={widget.isVisible}
                        onCheckedChange={() => handleVisibilityToggle(widget.id)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Widget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleWidgets
          .sort((a, b) => a.order - b.order)
          .map((widget) => {
            const Icon = widget.icon;
            return (
              <Card key={widget.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {widget.title}
                  </CardTitle>
                  {isConfigMode && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVisibilityToggle(widget.id)}
                    >
                      {widget.isVisible ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Widget content would appear here</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {visibleWidgets.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Widgets Visible</h3>
            <p className="text-muted-foreground mb-4">
              All widgets are currently hidden. Enable some widgets to see your dashboard.
            </p>
            <Button onClick={() => setIsConfigMode(true)}>
              Configure Widgets
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
