
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface RepositorySearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function RepositorySearch({ searchTerm, onSearchChange }: RepositorySearchProps) {
  return (
    <div className="flex items-center space-x-2 mb-6">
      <Search className="w-4 h-4 text-muted-foreground" />
      <Input
        placeholder="Search repositories..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
}
