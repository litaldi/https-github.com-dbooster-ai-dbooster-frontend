
import { Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function LoginHeader() {
  return (
    <header className="text-center space-y-4">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg hover-scale">
        <Database className="w-8 h-8 text-white" aria-hidden="true" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          DBooster
        </h1>
        <Badge variant="secondary" className="text-xs">
          AI-Powered Database Optimization
        </Badge>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
          Boost your database performance with AI-powered query optimization and intelligent insights
        </p>
      </div>
    </header>
  );
}
