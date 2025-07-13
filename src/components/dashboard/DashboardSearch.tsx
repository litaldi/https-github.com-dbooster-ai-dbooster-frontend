
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Clock, 
  Database, 
  FileText, 
  Settings,
  ArrowRight,
  Command
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardSearchProps {
  onClose: () => void;
}

export function DashboardSearch({ onClose }: DashboardSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const searchItems = [
    { title: 'Analytics Dashboard', type: 'page', href: '/app/analytics', icon: Database },
    { title: 'Query Manager', type: 'page', href: '/app/queries', icon: FileText },
    { title: 'Repository Settings', type: 'page', href: '/app/repositories', icon: Settings },
    { title: 'Security Dashboard', type: 'page', href: '/app/security', icon: Settings },
    { title: 'Account Settings', type: 'page', href: '/app/account', icon: Settings },
    { title: 'Performance Metrics', type: 'feature', description: 'View real-time performance data' },
    { title: 'Query Optimization', type: 'feature', description: 'AI-powered query suggestions' },
    { title: 'Database Connections', type: 'feature', description: 'Manage database connections' },
  ];

  useEffect(() => {
    if (query.length > 0) {
      const filtered = searchItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults(searchItems.slice(0, 6));
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Dashboard
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pages, features, or settings..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
            <div className="absolute right-3 top-2.5">
              <Badge variant="outline" className="text-xs">
                <Command className="h-3 w-3 mr-1" />
                ESC
              </Badge>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {results.length > 0 ? (
              results.map((item, index) => {
                const Icon = item.icon || FileText;
                const content = (
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-sm">{item.title}</div>
                        {item.description && (
                          <div className="text-xs text-muted-foreground">{item.description}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                );

                if (item.href) {
                  return (
                    <Link key={index} to={item.href} onClick={onClose}>
                      {content}
                    </Link>
                  );
                }

                return (
                  <div key={index}>
                    {content}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No results found for "{query}"</p>
              </div>
            )}
          </div>

          <div className="border-t pt-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Use ↑↓ to navigate, Enter to select, ESC to close</span>
              <div className="flex gap-2">
                <Badge variant="outline">⌘K</Badge>
                <span>Search</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
