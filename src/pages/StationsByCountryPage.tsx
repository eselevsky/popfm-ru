import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { StationCard } from '@/components/StationCard';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import type { RadioStation } from '@shared/types';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { translateCountry } from '@/lib/localization';
function StationGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[4/3] bg-retro-primary/10" />
      ))}
    </div>
  );
}
export function StationsByCountryPage() {
  const { countryName } = useParams<{ countryName: string }>();
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!countryName) return;
    async function fetchStationsByCountry() {
      try {
        setIsLoading(true);
        setError(null);
        const decodedCountryName = decodeURIComponent(countryName);
        const data = await api<RadioStation[]>(`/api/radio/stations?country=${decodedCountryName}&limit=100&order=votes&reverse=true`);
        setStations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchStationsByCountry();
  }, [countryName]);
  const decodedCountryName = countryName ? decodeURIComponent(countryName) : '��трана';
  const translatedCountryName = translateCountry(decodedCountryName);
  return (
    <AppLayout>
      <Helmet>
        <title>{`Радиостанции из ${translatedCountryName} - popfm.ru`}</title>
        <meta name="description" content={`Слушайте самые популярные онлайн-радиостанции из ${translatedCountryName} на popfm.ru.`} />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center text-lg text-retro-accent/80 mb-4">
              <Link to="/countries" className="hover:text-retro-primary">Страны</Link>
              <ChevronRight className="h-5 w-5 mx-1" />
              <span className="text-retro-accent">{translatedCountryName}</span>
            </div>
            <h1 className="font-pixel text-4xl md:text-5xl text-retro-primary mb-2">Станции из: {translatedCountryName}</h1>
            <p className="text-lg text-retro-accent/80 mb-8">Популярные станции из {translatedCountryName}.</p>
          </motion.div>
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
                <p className="text-retro-accent/80">Мы не смогли найти станции для этой страны.</p>
            </div>
           )}
        </div>
      </div>
    </AppLayout>
  );
}