
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, Database, Zap, Users, Settings, TrendingUp } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ElementType;
  path: string;
}

interface DashboardSearchProps {
  onClose: () => void;
}

export function DashboardSearch({ onClose }: DashboardSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  const searchData: SearchResult[] = [
    {
      id: '1',
      title: 'Query Manager',
      description: 'Optimize and analyze SQL queries',
      category: 'Tools',
      icon: Database,
      path: '/app/queries'
    },
    {
      id: '2',
      title: 'AI Studio',
      description: 'AI-powered optimization tools',
      category: 'AI',
      icon: Zap,
      path: '/app/ai-studio'
    },
    {
      id: '3',
      title: 'Performance Monitor',
      description: 'Real-time performance metrics',
      category: 'Monitoring',
      icon: TrendingUp,
      path: '/app/monitoring'
    },
    {
      id: '4',
      title: 'User Management',
      description: 'Manage team members and permissions',
      category: 'Admin',
      icon: Users,
      path: '/app/users'
    },
    {
      id: '5',
      title: 'Dashboard Settings',
      description: 'Configure dashboard preferences',
      category: 'Settings',
      icon: Settings,
      path: '/app/settings'
    }
  ];

  useEffect(() => {
    if (query.trim()) {
      const filtered = searchData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults(searchData.slice(0, 3)); // Show recent/popular items
    }
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    // Here you would navigate to the result
    console.log('Navigate to:', result.path);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Dashboard
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for features, tools, or settings..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
              autoFocus
            />
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto px-6 pb-6">
          {results.length > 0 ? (
            <div className="space-y-2 mt-4">
              <div className="text-sm text-muted-foreground mb-3">
                {query ? `Results for "${query}"` : 'Quick Access'}
              </div>
              {results.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <result.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{result.title}</div>
                      <div className="text-sm text-muted-foreground">{result.description}</div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {result.category}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try searching with different keywords
              </p>
            </div>
          ) : null}
        </div>

        <div className="border-t px-6 py-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-muted rounded">↑</kbd>
              <kbd className="px-1 py-0.5 bg-muted rounded">↓</kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-muted rounded">Enter</kbd>
              <span>Select</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-muted rounded">Esc</kbd>
              <span>Close</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
