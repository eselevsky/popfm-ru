import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}
export function SearchAndFilter({
  searchTerm,
  onSearchChange,
  placeholder = 'Поиск...',
}: SearchAndFilterProps) {
  return (
    <div className="relative mb-8">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-retro-secondary" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full max-w-lg pl-12 pr-4 py-6 text-lg font-mono bg-retro-background/50 border-2 border-retro-primary/30 focus:border-retro-secondary focus:ring-0 focus:shadow-glow-sm transition-all"
      />
    </div>
  );
}