
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <StandardPageLayout
      title="Search"
      subtitle="Find what you're looking for"
      description="Search through our documentation, features, and resources."
    >
      <div className="max-w-2xl mx-auto">
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            defaultValue={query}
            className="pl-10 h-12 text-lg"
          />
        </div>
        
        {query && (
          <div className="text-center text-muted-foreground">
            <p>Searching for: <strong>"{query}"</strong></p>
            <p className="mt-4">Search functionality coming soon!</p>
          </div>
        )}
      </div>
    </StandardPageLayout>
  );
}
