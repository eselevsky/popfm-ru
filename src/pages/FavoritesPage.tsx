import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StationCard } from '@/components/StationCard';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import type { RadioStation } from '@shared/types';
import { useFavoritesStore } from '@/store/favoritesStore';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
function StationGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[4/3] bg-retro-primary/10" />
      ))}
    </div>
  );
}
export function FavoritesPage() {
  const favorites = useFavoritesStore(s => s.favorites);
  const initialized = useFavoritesStore(s => s.initialized);
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!initialized) return;
    async function fetchFavoriteStations() {
      if (favorites.length === 0) {
        setStations([]);
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const uuids = favorites.join(',');
        const data = await api<RadioStation[]>(`/api/radio/stations/byuuid/${uuids}`);
        setStations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchFavoriteStations();
  }, [favorites, initialized]);
  return (
    <AppLayout>
      <Helmet>
        <title>Ваше избранное - popfm.ru</title>
        <meta name="description" content="Доступ к вашей личной коллекции любимых онлайн-радиостанций для быстрого и удобного прослушивания на popfm.ru." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-pixel text-4xl md:text-5xl text-retro-primary mb-2">Ваше избранное</h1>
            <p className="text-lg text-retro-accent/80 mb-8">Ваша личная коллекция лучших станций.</p>
          </motion.div>
          {(isLoading || !initialized) && <StationGridSkeleton />}
          {initialized && error && (
            <div className="flex flex-col items-center justify-center text-center py-16 bg-retro-background/50 border border-red-500/50 p-8">
              <AlertTriangle className="w-16 h-16 text-red-400 mb-4" />
              <h2 className="font-pixel text-2xl text-red-400 mb-2">Ошибка загрузки избранного</h2>
              <p className="text-retro-accent/80 max-w-md">{error}</p>
            </div>
          )}
          {initialized && !isLoading && !error && stations.length > 0 && (
            <AnimatePresence>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.05 },
                  },
                }}
              >
                {stations.map((station) => (
                  <StationCard key={station.stationuuid} station={station} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
          {initialized && !isLoading && !error && stations.length === 0 && (
            <div className="text-center py-16 flex flex-col items-center">
              <Star className="w-16 h-16 text-retro-secondary mb-4" />
              <h2 className="font-pixel text-2xl text-retro-secondary mb-2">В избранном пока пусто</h2>
              <p className="text-retro-accent/80 max-w-md mb-6">Нажмите на звездочку на любой станции, чтобы добавить ее в свою коллекцию.</p>
              <Link to="/" className="font-mono text-lg text-retro-primary hover:underline">Найти станции</Link>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}