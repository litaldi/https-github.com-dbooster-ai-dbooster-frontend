
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search } from 'lucide-react';

export default function QueriesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Query Manager</h1>
          <p className="text-muted-foreground mt-2">
            Optimize and manage your SQL queries with AI-powered recommendations.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Query
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Recent Queries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No queries found. Add your first query to get started!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
