
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, Clock, TrendingUp, Database, Settings } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: 'page' | 'action' | 'data';
  icon: React.ComponentType<{ className?: string }>;
  url?: string;
}

interface DashboardSearchProps {
  onClose: () => void;
}

export function DashboardSearch({ onClose }: DashboardSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const mockResults: SearchResult[] = [
    { id: '1', title: 'Performance Analytics', description: 'View detailed performance metrics', category: 'page', icon: TrendingUp, url: '/app/analytics' },
    { id: '2', title: 'Query Manager', description: 'Manage and optimize SQL queries', category: 'page', icon: Search, url: '/app/queries' },
    { id: '3', title: 'Database Connections', description: 'Manage repository connections', category: 'page', icon: Database, url: '/app/repositories' },
    { id: '4', title: 'Settings', description: 'Configure application settings', category: 'page', icon: Settings, url: '/app/settings' },
    { id: '5', title: 'Refresh Dashboard', description: 'Reload dashboard data', category: 'action', icon: Clock },
  ];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (query.trim()) {
      const filtered = mockResults.filter(result =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'page': return 'bg-blue-100 text-blue-800';
      case 'action': return 'bg-green-100 text-green-800';
      case 'data': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="bg-card border shadow-lg rounded-lg w-full max-w-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dashboard..."
            className="border-0 shadow-none focus-visible:ring-0 text-lg"
            onKeyDown={handleKeyDown}
          />
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-2">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => {
                    if (result.url) {
                      window.location.href = result.url;
                    }
                    onClose();
                  }}
                >
                  <result.icon className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium">{result.title}</div>
                    <div className="text-sm text-muted-foreground">{result.description}</div>
                  </div>
                  <Badge variant="secondary" className={getCategoryColor(result.category)}>
                    {result.category}
                  </Badge>
                </div>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="p-8 text-center text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              Start typing to search the dashboard...
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
