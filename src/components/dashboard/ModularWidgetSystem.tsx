
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  GripVertical, 
  BarChart3, 
  Activity, 
  Database, 
  Shield,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';

interface Widget {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  isVisible: boolean;
  order: number;
}

export const defaultWidgets: Widget[] = [
  {
    id: 'performance',
    title: 'Performance Metrics',
    description: 'Real-time database performance indicators',
    icon: BarChart3,
    isVisible: true,
    order: 1,
  },
  {
    id: 'activity',
    title: 'System Activity',
    description: 'Current system activity and load',
    icon: Activity,
    isVisible: true,
    order: 2,
  },
  {
    id: 'database',
    title: 'Database Status',
    description: 'Connection and health monitoring',
    icon: Database,
    isVisible: true,
    order: 3,
  },
  {
    id: 'security',
    title: 'Security Monitor',
    description: 'Security events and threat detection',
    icon: Shield,
    isVisible: false,
    order: 4,
  },
];

interface ModularWidgetSystemProps {
  initialWidgets?: Widget[];
  onWidgetReorder?: (widgets: Widget[]) => void;
  onWidgetVisibilityToggle?: (widgetId: string, isVisible: boolean) => void;
}

export function ModularWidgetSystem({
  initialWidgets = defaultWidgets,
  onWidgetReorder,
  onWidgetVisibilityToggle,
}: ModularWidgetSystemProps) {
  const [widgets, setWidgets] = useState(initialWidgets);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedWidgets = items.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setWidgets(updatedWidgets);
    onWidgetReorder?.(updatedWidgets);
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    const updatedWidgets = widgets.map(widget =>
      widget.id === widgetId
        ? { ...widget, isVisible: !widget.isVisible }
        : widget
    );
    setWidgets(updatedWidgets);
    
    const widget = updatedWidgets.find(w => w.id === widgetId);
    if (widget) {
      onWidgetVisibilityToggle?.(widgetId, widget.isVisible);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Widget Configuration</h2>
          <p className="text-muted-foreground">
            Customize your dashboard layout by reordering and toggling widgets
          </p>
        </div>
        <Badge variant="outline">
          {widgets.filter(w => w.isVisible).length} of {widgets.length} visible
        </Badge>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="widgets">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {widgets.map((widget, index) => (
                <Draggable key={widget.id} draggableId={widget.id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`transition-shadow ${
                        snapshot.isDragging ? 'shadow-lg' : ''
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab hover:cursor-grabbing"
                            >
                              <GripVertical className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <widget.icon className="h-5 w-5 text-primary" />
                            <div>
                              <CardTitle className="text-lg">{widget.title}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {widget.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleWidgetVisibility(widget.id)}
                            >
                              {widget.isVisible ? (
                                <Eye className="h-4 w-4" />
                              ) : (
                                <EyeOff className="h-4 w-4" />
                              )}
                            </Button>
                            <Switch
                              checked={widget.isVisible}
                              onCheckedChange={() => toggleWidgetVisibility(widget.id)}
                            />
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
