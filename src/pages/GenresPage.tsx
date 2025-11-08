import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import type { StationTag } from '@shared/types';
import { motion } from 'framer-motion';
import { AlertTriangle, Music } from 'lucide-react';
import { SearchAndFilter } from '@/components/SearchAndFilter';
import { Helmet } from 'react-helmet-async';
function GenreGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: 18 }).map((_, i) => (
        <Skeleton key={i} className="h-24 bg-retro-primary/10" />
      ))}
    </div>
  );
}
export function GenresPage() {
  const [tags, setTags] = useState<StationTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    async function fetchTags() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await api<StationTag[]>('/api/radio/tags?order=stationcount&reverse=true&hidebroken=true');
        setTags(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchTags();
  }, []);
  const filteredTags = useMemo(() => {
    return tags.filter(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [tags, searchTerm]);
  return (
    <AppLayout>
      <Helmet>
        <title>Поиск по жанрам - popfm.ru</title>
        <meta name="description" content="Находите онлайн-радиостанции, просматривая огромную коллекцию жанров, от рока и поп-музыки до джаза и классики, на popfm.ru." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-pixel text-4xl md:text-5xl text-retro-primary mb-2">Поиск по жанрам</h1>
            <p className="text-lg text-retro-accent/80 mb-8">Находите станции ваших люби��ых жанров.</p>
          </motion.div>
          <SearchAndFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Найти жанр..." />
          {isLoading && <GenreGridSkeleton />}
          {error && (
            <div className="flex flex-col items-center justify-center text-center py-16 bg-retro-background/50 border border-red-500/50 p-8">
              <AlertTriangle className="w-16 h-16 text-red-400 mb-4" />
              <h2 className="font-pixel text-2xl text-red-400 mb-2">Ошибка загрузки жанров</h2>
              <p className="text-retro-accent/80 max-w-md">{error}</p>
            </div>
          )}
          {!isLoading && !error && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredTags.map((tag) => (
                <Link
                  to={`/genres/${encodeURIComponent(tag.name)}`}
                  key={tag.name}
                  className="group relative flex flex-col items-center justify-center text-center p-4 bg-black/30 border-2 border-retro-primary/30 hover:border-retro-secondary hover:shadow-glow transition-all duration-300 h-24"
                >
                  <Music className="w-6 h-6 text-retro-secondary mb-2 transition-transform group-hover:scale-110" />
                  <h3 className="font-mono text-sm font-bold text-retro-accent capitalize line-clamp-2">{tag.name}</h3>
                  <p className="text-xs text-retro-secondary/70">{tag.stationcount} станций</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}