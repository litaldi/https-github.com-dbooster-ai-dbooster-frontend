
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Database, 
  FileText, 
  Users, 
  Settings, 
  Zap,
  Filter,
  Clock,
  Bookmark,
  TrendingUp,
  X,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'page' | 'query' | 'database' | 'user' | 'setting' | 'report';
  url: string;
  category: string;
  metadata?: {
    lastModified?: Date;
    author?: string;
    tags?: string[];
    performance?: number;
  };
  highlighted?: boolean;
}

interface SearchCategory {
  key: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
}

const searchCategories: SearchCategory[] = [
  { key: 'all', label: 'All', icon: Search, color: 'text-gray-600' },
  { key: 'pages', label: 'Pages', icon: FileText, color: 'text-blue-600' },
  { key: 'queries', label: 'Queries', icon: Database, color: 'text-green-600' },
  { key: 'reports', label: 'Reports', icon: TrendingUp, color: 'text-purple-600' },
  { key: 'settings', label: 'Settings', icon: Settings, color: 'text-orange-600' },
];

// Mock search data - in real app, this would come from API
const mockResults: SearchResult[] = [
  {
    id: '1',
    title: 'Dashboard',
    description: 'Main dashboard with performance metrics and system overview',
    type: 'page',
    url: '/',
    category: 'pages',
    metadata: { lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000) }
  },
  {
    id: '2',
    title: 'User Management Query',
    description: 'SELECT * FROM users WHERE status = "active" ORDER BY created_at DESC',
    type: 'query',
    url: '/queries/user-management',
    category: 'queries',
    metadata: { 
      lastModified: new Date(Date.now() - 30 * 60 * 1000),
      author: 'John Doe',
      performance: 95,
      tags: ['users', 'active', 'management']
    }
  },
  {
    id: '3',
    title: 'Performance Report - Q4 2024',
    description: 'Quarterly database performance analysis and optimization recommendations',
    type: 'report',
    url: '/reports/q4-2024-performance',
    category: 'reports',
    metadata: { 
      lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000),
      author: 'System',
      tags: ['performance', 'quarterly', 'analysis']
    }
  },
  {
    id: '4',
    title: 'Database Connection Settings',
    description: 'Configure database connections and authentication settings',
    type: 'setting',
    url: '/settings/database-connections',
    category: 'settings',
    metadata: { lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
  },
  {
    id: '5',
    title: 'Orders Performance Query',
    description: 'Optimized query for orders table with JOIN optimization',
    type: 'query',
    url: '/queries/orders-performance',
    category: 'queries',
    metadata: { 
      performance: 87,
      tags: ['orders', 'join', 'optimization'],
      author: 'Jane Smith'
    }
  },
  {
    id: '6',
    title: 'PostgreSQL Production DB',
    description: 'Main production database - PostgreSQL 14.2',
    type: 'database',
    url: '/repositories/postgresql-prod',
    category: 'databases',
    metadata: { tags: ['postgresql', 'production', 'primary'] }
  }
];

export function UniversalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dbooster_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search functionality
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    const searchTimeout = setTimeout(() => {
      const filtered = mockResults.filter(result => {
        const matchesQuery = 
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.description.toLowerCase().includes(query.toLowerCase()) ||
          result.metadata?.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
        
        const matchesCategory = selectedCategory === 'all' || result.category === selectedCategory;
        
        return matchesQuery && matchesCategory;
      });

      // Sort by relevance (simple scoring)
      const scored = filtered.map(result => ({
        ...result,
        score: 
          (result.title.toLowerCase().includes(query.toLowerCase()) ? 10 : 0) +
          (result.description.toLowerCase().includes(query.toLowerCase()) ? 5 : 0) +
          (result.metadata?.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ? 3 : 0)
      })).sort((a, b) => b.score - a.score);

      setResults(scored);
      setSelectedIndex(-1);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, selectedCategory]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        handleResultClick(results[selectedIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleResultClick = (result: SearchResult) => {
    // Save to recent searches
    const newRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('dbooster_recent_searches', JSON.stringify(newRecent));

    // Navigate
    navigate(result.url);
    setIsOpen(false);
    setQuery('');
    
    toast({
      title: "Navigating...",
      description: `Opening ${result.title}`
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('dbooster_recent_searches');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'page': return <FileText className="h-4 w-4" />;
      case 'query': return <Database className="h-4 w-4" />;
      case 'database': return <Database className="h-4 w-4" />;
      case 'user': return <Users className="h-4 w-4" />;
      case 'setting': return <Settings className="h-4 w-4" />;
      case 'report': return <TrendingUp className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'page': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'query': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'database': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30';
      case 'user': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'setting': return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
      case 'report': return 'text-pink-600 bg-pink-100 dark:bg-pink-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  return (
    <>
      {/* Search Trigger */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="relative w-64 justify-start text-muted-foreground"
      >
        <Search className="h-4 w-4 mr-2" />
        <span>Search everything...</span>
        <Badge variant="outline" className="ml-auto">
          ⌘K
        </Badge>
      </Button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60"
              onClick={() => setIsOpen(false)}
            />

            {/* Search Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-2xl mx-4"
            >
              <Card className="shadow-2xl border">
                <CardContent className="p-0">
                  {/* Search Input */}
                  <div className="p-4 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        ref={inputRef}
                        placeholder="Search pages, queries, databases, settings..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-9 pr-9"
                        autoFocus
                      />
                      {query && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                          onClick={() => setQuery('')}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

                    {/* Categories */}
                    <div className="flex gap-1 mt-3 overflow-x-auto">
                      {searchCategories.map(category => {
                        const Icon = category.icon;
                        return (
                          <Button
                            key={category.key}
                            variant={selectedCategory === category.key ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setSelectedCategory(category.key)}
                            className="flex-shrink-0"
                          >
                            <Icon className={`h-3 w-3 mr-1 ${category.color}`} />
                            {category.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Results */}
                  <ScrollArea className="max-h-96">
                    {!query && recentSearches.length > 0 && (
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Recent Searches
                          </h3>
                          <Button variant="ghost" size="sm" onClick={clearRecentSearches}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((search, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="cursor-pointer hover:bg-accent"
                              onClick={() => setQuery(search)}
                            >
                              {search}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {query && (
                      <div className="p-2">
                        {isLoading ? (
                          <div className="p-8 text-center text-muted-foreground">
                            <Search className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                            <p>Searching...</p>
                          </div>
                        ) : results.length === 0 ? (
                          <div className="p-8 text-center text-muted-foreground">
                            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No results found for "{query}"</p>
                            <p className="text-sm mt-1">Try different keywords or check your spelling</p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {results.map((result, index) => (
                              <motion.div
                                key={result.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`p-3 rounded-lg cursor-pointer transition-all group ${
                                  selectedIndex === index 
                                    ? 'bg-accent ring-1 ring-ring' 
                                    : 'hover:bg-accent/50'
                                }`}
                                onClick={() => handleResultClick(result)}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`p-1 rounded ${getTypeColor(result.type)}`}>
                                    {getTypeIcon(result.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                      <h4 className="font-medium text-sm truncate">
                                        {result.title}
                                      </h4>
                                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                      {result.description}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <Badge variant="outline" className="text-xs">
                                        {result.type}
                                      </Badge>
                                      {result.metadata?.tags && (
                                        <div className="flex gap-1">
                                          {result.metadata.tags.slice(0, 2).map(tag => (
                                            <Badge key={tag} variant="secondary" className="text-xs">
                                              {tag}
                                            </Badge>
                                          ))}
                                        </div>
                                      )}
                                      {result.metadata?.performance && (
                                        <Badge variant="outline" className="text-xs">
                                          {result.metadata.performance}% optimized
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </ScrollArea>

                  {/* Footer */}
                  <div className="p-3 border-t bg-muted/30">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span>↑↓ Navigate</span>
                        <span>⏎ Select</span>
                        <span>Esc Close</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Filter className="h-3 w-3" />
                        <span>Filter by category</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export function SearchTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setIsOpen(true)}
      className="relative"
    >
      <Search className="h-4 w-4 mr-1" />
      Search
    </Button>
  );
}
