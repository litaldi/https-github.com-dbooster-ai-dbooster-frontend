
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PlayCircle, BookOpen, DollarSign } from 'lucide-react';
import { FadeIn, HoverScale } from '@/components/ui/animations';
import { Text } from '@/components/ui/visual-hierarchy';

interface QuickAction {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action: () => void;
  color: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <FadeIn delay={1.0}>
      <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {actions.map((action, index) => (
          <HoverScale key={index}>
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 group focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
              onClick={action.action}
              role="button"
              tabIndex={0}
              aria-label={`${action.title}: ${action.description}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  action.action();
                }
              }}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <Text className="font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                  {action.title}
                </Text>
                <Text size="sm" variant="muted" className="leading-relaxed">
                  {action.description}
                </Text>
              </CardContent>
            </Card>
          </HoverScale>
        ))}
      </div>
    </FadeIn>
  );
}
