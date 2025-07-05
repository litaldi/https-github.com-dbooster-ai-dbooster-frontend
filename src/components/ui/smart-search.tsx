
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, History, TrendingUp, Command, FileText, HelpCircle, Home } from 'lucide-react';
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
  category: 'feature' | 'docs' | 'page' | 'help';
  url: string;
  relevance: number;
}

interface SmartSearchProps {
  placeholder?: string;
  className?: string;
  compact?: boolean;
  showRecentSearches?: boolean;
  autoFocus?: boolean;
}

const searchResults: SearchResult[] = [
  {
    id: '1',
    title: 'Dashboard',
    description: 'AI-powered database optimization center',
    category: 'page',
    url: '/app',
    relevance: 0.9
  },
  {
    id: '2',
    title: 'Query Optimization',
    description: 'Optimize your database queries with AI assistance',
    category: 'feature',
    url: '/app/queries',
    relevance: 0.95
  },
  {
    id: '3',
    title: 'Performance Reports',
    description: 'View detailed performance analytics and insights',
    category: 'feature',
    url: '/app/reports',
    relevance: 0.85
  },
  {
    id: '4',
    title: 'Getting Started Guide',
    description: 'Learn how to optimize your first query',
    category: 'docs',
    url: '/docs/getting-started',
    relevance: 0.8
  },
  {
    id: '5',
    title: 'FAQ',
    description: 'Frequently asked questions and answers',
    category: 'help',
    url: '/support/faq',
    relevance: 0.7
  },
  {
    id: '6',
    title: 'Contact Support',
    description: 'Get help from our expert team',
    category: 'help',
    url: '/support',
    relevance: 0.6
  }
];

export function SmartSearch({ 
  placeholder = "Find what you need...", 
  className,
  compact = false,
  showRecentSearches = true,
  autoFocus = false
}: SmartSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    
    setTimeout(() => {
      const filtered = searchResults.filter(result =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).sort((a, b) => b.relevance - a.relevance);
      
      setResults(filtered);
      setIsLoading(false);
    }, 300);

    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent-searches', JSON.stringify(updated));
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
    feature: TrendingUp,
    docs: FileText,
    page: Home,
    help: HelpCircle
  };

  const categoryStyles = {
    feature: 'bg-blue-500/10 text-blue-600',
    docs: 'bg-purple-500/10 text-purple-600',
    page: 'bg-green-500/10 text-green-600',
    help: 'bg-orange-500/10 text-orange-600'
  };

  return (
    <div ref={searchRef} className={cn('relative w-full', compact ? 'max-w-sm' : 'max-w-md', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          className={cn(
            "pl-10 pr-10 focus-ring transition-all duration-200",
            compact ? "h-9" : "h-11",
            isOpen && "ring-2 ring-primary/20"
          )}
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
        {!compact && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground flex items-center gap-1">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        )}
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-xl border bg-card/95 backdrop-blur-sm">
          <CardContent className="p-0 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                <Search className="h-4 w-4 animate-spin mx-auto mb-2" />
                Searching...
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b">
                  Search Results
                </div>
                {results.map((result) => {
                  const Icon = categoryIcons[result.category];
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b last:border-0 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'p-1.5 rounded-md transition-colors',
                          categoryStyles[result.category],
                          'group-hover:scale-110'
                        )}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm group-hover:text-primary transition-colors">
                            {result.title}
                          </div>
                          <div className="text-xs text-muted-foreground truncate mt-0.5 leading-relaxed">
                            {result.description}
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {result.category}
                        </Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : query ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <Search className="h-8 w-8 opacity-40" />
                  <p>No results found for "{query}"</p>
                  <p className="text-xs">Try different keywords or check our help section</p>
                </div>
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
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <History className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
                      <span className="group-hover:text-primary transition-colors">{search}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <Search className="h-8 w-8 opacity-40" />
                  <p>Start typing to find what you need</p>
                  <p className="text-xs">Try searching for features, docs, or help topics</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
