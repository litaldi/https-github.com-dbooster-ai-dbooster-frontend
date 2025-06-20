import { Card, CardContent } from './card';
import { EnhancedButton } from './enhanced-button';
import { Database, Zap, BarChart, Users, Plus, Search, FileText } from 'lucide-react';
import { FadeIn } from './animations';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ 
  icon: Icon = Database, 
  title, 
  description, 
  action, 
  secondaryAction,
  className 
}: EmptyStateProps) {
  return (
    <FadeIn>
      <Card className={`border-dashed border-2 ${className}`}>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Icon className="h-8 w-8 text-muted-foreground" />
          </div>
          
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">{description}</p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {action && (
              <EnhancedButton onClick={action.onClick} size="lg">
                {action.label}
              </EnhancedButton>
            )}
            {secondaryAction && (
              <EnhancedButton 
                variant="outline" 
                onClick={secondaryAction.onClick}
                size="lg"
              >
                {secondaryAction.label}
              </EnhancedButton>
            )}
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  );
}

// Predefined empty states for common scenarios
export function DatabaseEmptyState({ onConnect }: { onConnect: () => void }) {
  return (
    <EmptyState
      icon={Database}
      title="No Databases Connected"
      description="Connect your first database to start optimizing query performance and monitoring database health."
      action={{
        label: "Connect Database",
        onClick: onConnect
      }}
      secondaryAction={{
        label: "View Documentation",
        onClick: () => window.open('/docs/database-connection', '_blank')
      }}
    />
  );
}

export function QueriesEmptyState({ onAnalyze }: { onAnalyze: () => void }) {
  return (
    <EmptyState
      icon={Zap}
      title="No Queries Analyzed Yet"
      description="Upload your SQL queries or connect a database to get AI-powered optimization recommendations."
      action={{
        label: "Analyze Queries",
        onClick: onAnalyze
      }}
      secondaryAction={{
        label: "Upload SQL File",
        onClick: () => document.getElementById('sql-upload')?.click()
      }}
    />
  );
}

export function ReportsEmptyState({ onGenerate }: { onGenerate: () => void }) {
  return (
    <EmptyState
      icon={BarChart}
      title="No Performance Reports"
      description="Generate your first performance report to track query optimization progress and database health metrics."
      action={{
        label: "Generate Report",
        onClick: onGenerate
      }}
    />
  );
}

export function TeamsEmptyState({ onInvite }: { onInvite: () => void }) {
  return (
    <EmptyState
      icon={Users}
      title="Build Your Team"
      description="Invite team members to collaborate on database optimization and share performance insights."
      action={{
        label: "Invite Team Members",
        onClick: onInvite
      }}
    />
  );
}

export function SearchEmptyState({ searchTerm }: { searchTerm: string }) {
  return (
    <EmptyState
      icon={Search}
      title="No Results Found"
      description={`We couldn't find anything matching "${searchTerm}". Try adjusting your search terms or filters.`}
      action={{
        label: "Clear Search",
        onClick: () => window.location.reload()
      }}
    />
  );
}
