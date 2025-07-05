
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Database, FileText, Search, Users, AlertCircle } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
      <CardContent className="space-y-4">
        <div className="mx-auto w-12 h-12 text-muted-foreground">
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-muted-foreground text-sm max-w-[400px]">{description}</p>
        </div>
        {action && (
          <Button onClick={action.onClick} className="mt-4">
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function NoQueriesFound({ onCreateQuery }: { onCreateQuery: () => void }) {
  return (
    <EmptyState
      icon={<Search className="w-full h-full" />}
      title="No queries found"
      description="You haven't created any database queries yet. Create your first query to get started with optimization."
      action={{
        label: "Create Query",
        onClick: onCreateQuery
      }}
    />
  );
}

export function NoRepositoriesFound({ onConnectRepo }: { onConnectRepo: () => void }) {
  return (
    <EmptyState
      icon={<Database className="w-full h-full" />}
      title="No repositories connected"
      description="Connect your first repository to start analyzing and optimizing your database queries."
      action={{
        label: "Connect Repository",
        onClick: onConnectRepo
      }}
    />
  );
}

export function NoReportsFound() {
  return (
    <EmptyState
      icon={<FileText className="w-full h-full" />}
      title="No reports available"
      description="Reports will appear here once you start running query optimizations and performance analyses."
    />
  );
}

export function NoUsersFound() {
  return (
    <EmptyState
      icon={<Users className="w-full h-full" />}
      title="No users found"
      description="No users match your current search criteria. Try adjusting your filters."
    />
  );
}

export function ErrorState({ 
  title = "Something went wrong",
  description = "We encountered an error while loading this content. Please try again.",
  onRetry
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      icon={<AlertCircle className="w-full h-full text-destructive" />}
      title={title}
      description={description}
      action={onRetry ? {
        label: "Try Again",
        onClick: onRetry
      } : undefined}
    />
  );
}
