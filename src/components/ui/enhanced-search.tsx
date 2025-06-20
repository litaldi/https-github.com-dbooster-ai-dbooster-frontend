
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, History, TrendingUp, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: 'page' | 'feature' | 'docs' | 'query';
  url: string;
  relevance: number;
}

interface EnhancedSearchProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  showRecentSearches?: boolean;
  autoFocus?: boolean;
}

export function EnhancedSearch({ 
  placeholder = "Search everything...", 
  className,
  onSearch,
  showRecentSearches = true,
  autoFocus = false
}: EnhancedSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock search data
  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'Dashboard',
      description: 'AI-powered database optimization center',
      category: 'page',
      url: '/app/dashboard',
      relevance: 0.9
    },
    {
      id: '2',
      title: 'Query Optimization',
      description: 'Optimize your database queries with AI',
      category: 'feature',
      url: '/app/query-optimization',
      relevance: 0.8
    },
    {
      id: '3',
      title: 'Performance Monitor',
      description: 'Real-time database performance monitoring',
      category: 'feature',
      url: '/app/performance',
      relevance: 0.85
    },
    {
      id: '4',
      title: 'Visual Query Builder',
      description: 'Build queries visually with drag-and-drop',
      category: 'feature',
      url: '/app/query-builder',
      relevance: 0.75
    }
  ];

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Auto-focus if specified
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    // Click outside to close
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const filtered = mockResults.filter(result =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).sort((a, b) => b.relevance - a.relevance);
      
      setResults(filtered);
      setIsLoading(false);
    }, 300);

    // Save to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent-searches', JSON.stringify(updated));

    onSearch?.(searchQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 0) {
      setIsOpen(true);
      handleSearch(value);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    setIsOpen(false);
    setQuery('');
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    handleSearch(search);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent-searches');
  };

  const categoryIcons = {
    page: Command,
    feature: TrendingUp,
    docs: Search,
    query: Search
  };

  const categoryColors = {
    page: 'bg-blue-500/10 text-blue-600',
    feature: 'bg-green-500/10 text-green-600',
    docs: 'bg-purple-500/10 text-purple-600',
    query: 'bg-orange-500/10 text-orange-600'
  };

  return (
    <div ref={searchRef} className={cn('relative w-full max-w-md', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10 focus-ring"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted/50"
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg border bg-card/95 backdrop-blur-sm">
          <CardContent className="p-0 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                <Search className="h-4 w-4 animate-spin mx-auto mb-2" />
                Searching...
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((result) => {
                  const Icon = categoryIcons[result.category];
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b last:border-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'p-1 rounded',
                          categoryColors[result.category]
                        )}>
                          <Icon className="h-3 w-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{result.title}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {result.description}
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {result.category}
                        </Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : query ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No results found for "{query}"
              </div>
            ) : showRecentSearches && recentSearches.length > 0 ? (
              <div className="py-2">
                <div className="px-4 py-2 flex items-center justify-between border-b">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <History className="h-3 w-3" />
                    Recent Searches
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearRecentSearches}
                    className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </Button>
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(search)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <History className="h-3 w-3 text-muted-foreground" />
                      {search}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Start typing to search...
              </div>
            )}
          </CardContent>
        </Car>
      )}
    </div>
  );
}

// Keyboard shortcut hook for search
export function useSearchShortcut(onActivate: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onActivate();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onActivate]);
}
