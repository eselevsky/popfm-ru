import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import type { StationCountry } from '@shared/types';
import { motion } from 'framer-motion';
import { AlertTriangle, Globe } from 'lucide-react';
import { SearchAndFilter } from '@/components/SearchAndFilter';
import { Helmet } from 'react-helmet-async';
function CountryGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: 18 }).map((_, i) => (
        <Skeleton key={i} className="h-24 bg-retro-primary/10" />
      ))}
    </div>
  );
}
export function CountriesPage() {
  const [countries, setCountries] = useState<StationCountry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    async function fetchCountries() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await api<StationCountry[]>('/api/radio/countries?order=stationcount&reverse=true');
        setCountries(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchCountries();
  }, []);
  const filteredCountries = useMemo(() => {
    return countries.filter(country => country.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [countries, searchTerm]);
  return (
    <AppLayout>
      <Helmet>
        <title>Browse by Country - PixelPop FM</title>
        <meta name="description" content="Explore online radio stations from countries all over the world. Find your favorite international broadcast on PixelPop FM." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-pixel text-4xl md:text-5xl text-retro-primary mb-2">Browse by Country</h1>
            <p className="text-lg text-retro-accent/80 mb-8">Explore radio stations from around the world.</p>
          </motion.div>
          <SearchAndFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Search countries..." />
          {isLoading && <CountryGridSkeleton />}
          {error && (
            <div className="flex flex-col items-center justify-center text-center py-16 bg-retro-background/50 border border-red-500/50 p-8">
              <AlertTriangle className="w-16 h-16 text-red-400 mb-4" />
              <h2 className="font-pixel text-2xl text-red-400 mb-2">Error Fetching Countries</h2>
              <p className="text-retro-accent/80 max-w-md">{error}</p>
            </div>
          )}
          {!isLoading && !error && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredCountries.map((country) => (
                <Link
                  to={`/countries/${encodeURIComponent(country.name)}`}
                  key={country.iso_3166_1}
                  className="group relative flex flex-col items-center justify-center text-center p-4 bg-black/30 border-2 border-retro-primary/30 hover:border-retro-secondary hover:shadow-glow transition-all duration-300 h-24"
                >
                  <Globe className="w-6 h-6 text-retro-secondary mb-2 transition-transform group-hover:scale-110" />
                  <h3 className="font-mono text-sm font-bold text-retro-accent line-clamp-2">{country.name}</h3>
                  <p className="text-xs text-retro-secondary/70">{country.stationcount} stations</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}