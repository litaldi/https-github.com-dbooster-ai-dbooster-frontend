
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, SortAsc, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: 'page' | 'feature' | 'docs' | 'help';
  url: string;
  relevance: number;
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'Dashboard',
      description: 'AI-powered database optimization center with real-time analytics',
      category: 'page',
      url: '/app',
      relevance: 0.9
    },
    {
      id: '2',
      title: 'Query Optimization',
      description: 'Optimize your database queries with AI-powered recommendations',
      category: 'feature',
      url: '/queries',
      relevance: 0.85
    },
    {
      id: '3',
      title: 'Repository Management',
      description: 'Connect and manage your database repositories',
      category: 'feature',
      url: '/repositories',
      relevance: 0.8
    },
    {
      id: '4',
      title: 'Performance Reports',
      description: 'Detailed analytics and performance insights',
      category: 'feature',
      url: '/reports',
      relevance: 0.75
    },
    {
      id: '5',
      title: 'AI Studio',
      description: 'Interactive AI-powered optimization workspace',
      category: 'feature',
      url: '/ai-studio',
      relevance: 0.9
    },
    {
      id: '6',
      title: 'Getting Started Guide',
      description: 'Learn how to optimize your first database query',
      category: 'docs',
      url: '/learn',
      relevance: 0.7
    },
    {
      id: '7',
      title: 'Support Center',
      description: 'Get help and find answers to common questions',
      category: 'help',
      url: '/support',
      relevance: 0.6
    }
  ];

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery: string) => {
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
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      performSearch(query.trim());
    }
  };

  const filteredResults = selectedCategory === 'all' 
    ? results 
    : results.filter(result => result.category === selectedCategory);

  const categories = ['all', ...Array.from(new Set(results.map(r => r.category)))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-12">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Search Results</h1>
          <p className="text-muted-foreground">
            Find everything you need across DBooster
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search features, docs, help..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Filters */}
        {results.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category === 'all' ? 'All Results' : category}
              </Button>
            ))}
          </div>
        )}

        {/* Search Results */}
        {query && (
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <Search className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Searching...</p>
              </div>
            ) : filteredResults.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  Found {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} for "{query}"
                </p>
                {filteredResults.map((result) => (
                  <Card key={result.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{result.title}</h3>
                            <Badge variant="outline" className="text-xs capitalize">
                              {result.category}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-4">{result.description}</p>
                          <Button asChild variant="outline" size="sm">
                            <Link to={result.url}>
                              Visit Page
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : query ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">
                  We couldn't find anything matching "{query}". Try different keywords or browse our features.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild variant="outline">
                    <Link to="/features">Browse Features</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/support">Get Help</Link>
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Popular Searches */}
        {!query && (
          <Card>
            <CardHeader>
              <CardTitle>Popular Searches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Query Optimization', 'Dashboard', 'Reports', 'AI Studio'].map((term) => (
                  <Button
                    key={term}
                    variant="ghost"
                    className="justify-start"
                    onClick={() => {
                      setQuery(term);
                      setSearchParams({ q: term });
                      performSearch(term);
                    }}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    {term}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
