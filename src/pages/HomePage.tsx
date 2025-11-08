import { useEffect, useState, useCallback } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StationCard } from '@/components/StationCard';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import type { RadioStation } from '@shared/types';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { SearchAndFilter } from '@/components/SearchAndFilter';
import { useDebounce } from 'react-use';
import { Helmet } from 'react-helmet-async';
function StationGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {Array.from({ length: 20 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[4/3] bg-retro-primary/10" />
      ))}
    </div>
  );
}
export function HomePage() {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500, [searchTerm]);
  const fetchStations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.append('limit', '100');
      params.append('hidebroken', 'true');
      if (debouncedSearchTerm) {
        params.append('name', debouncedSearchTerm);
      } else {
        params.append('countrycode', 'RU');
        params.append('order', 'votes');
        params.append('reverse', 'true');
      }
      const data = await api<RadioStation[]>(`/api/radio/stations?${params.toString()}`);
      setStations(data);
    } catch (err) {
      console.error("Failed to fetch stations:", err);
      setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm]);
  useEffect(() => {
    fetchStations();
  }, [fetchStations]);
  return (
    <AppLayout>
      <Helmet>
        <title>Радио слушать онлайн бесплатно - popFM.ru</title>
        <meta name="description" content="Слушайте более 10000 онлайн радио в прямом эфире. Популярное русское и заруб��жное радио, самая удобная возможность слушать радио бесплатно в хорошем качестве." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-pixel text-4xl md:text-5xl text-retro-primary mb-2">
              {debouncedSearchTerm ? `Результаты по "${debouncedSearchTerm}"` : 'Популярные станции России'}
            </h1>
            <p className="text-lg text-retro-accent/80 mb-8">
              {debouncedSearchTerm ? 'Станции, соответствующие вашему поиску.' : 'Лучшие радиостанции из России.'}
            </p>
          </motion.div>
          <SearchAndFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Найти станцию..." />
          {isLoading && <StationGridSkeleton />}
          {error && (
            <div className="flex flex-col items-center justify-center text-center py-16 bg-retro-background/50 border border-red-500/50 p-8">
              <AlertTriangle className="w-16 h-16 text-red-400 mb-4" />
              <h2 className="font-pixel text-2xl text-red-400 mb-2">Ошибка загрузки станций</h2>
              <p className="text-retro-accent/80 max-w-md">{error}</p>
            </div>
          )}
          {!isLoading && !error && stations.length > 0 && (
            <AnimatePresence>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                    },
                  },
                }}
              >
                {stations.map((station) => (
                  <StationCard key={station.stationuuid} station={station} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
          {!isLoading && !error && stations.length === 0 && (
             <div className="text-center py-16">
                <h2 className="font-pixel text-2xl text-retro-secondary mb-2">Станции не найдены</h2>
                <p className="text-retro-accent/80">Попробуйте другой поисковый запрос.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}