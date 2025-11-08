import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
import type { RadioStation } from '@shared/types';
import { usePlayerStore } from '@/store/playerStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import { motion } from 'framer-motion';
import { AlertTriangle, ChevronRight, Play, Pause, Star, Heart, Radio, Globe, Tag, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Helmet } from 'react-helmet-async';
function StationDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <Skeleton className="aspect-square w-full bg-retro-primary/10" />
      </div>
      <div className="md:col-span-2 space-y-6">
        <Skeleton className="h-12 w-3/4 bg-retro-primary/10" />
        <Skeleton className="h-6 w-1/2 bg-retro-primary/10" />
        <div className="flex gap-4">
          <Skeleton className="h-12 w-32 bg-retro-primary/10" />
          <Skeleton className="h-12 w-12 bg-retro-primary/10" />
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4">
          <Skeleton className="h-8 w-full bg-retro-primary/10" />
          <Skeleton className="h-8 w-full bg-retro-primary/10" />
          <Skeleton className="h-8 w-full bg-retro-primary/10" />
          <Skeleton className="h-8 w-full bg-retro-primary/10" />
        </div>
      </div>
    </div>
  );
}
export function StationDetailPage() {
  const { stationuuid } = useParams<{ stationuuid: string }>();
  const [station, setStation] = useState<RadioStation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const playStation = usePlayerStore(s => s.playStation);
  const currentStation = usePlayerStore(s => s.currentStation);
  const status = usePlayerStore(s => s.status);
  const favorites = useFavoritesStore(s => s.favorites);
  const addFavorite = useFavoritesStore(s => s.addFavorite);
  const removeFavorite = useFavoritesStore(s => s.removeFavorite);
  const isPlaying = currentStation?.stationuuid === station?.stationuuid && status === 'playing';
  const isFavorite = station ? favorites.includes(station.stationuuid) : false;
  useEffect(() => {
    if (!stationuuid) return;
    async function fetchStation() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await api<RadioStation[]>(`/api/radio/stations/byuuid/${stationuuid}`);
        if (data && data.length > 0) {
          setStation(data[0]);
        } else {
          setError('Station not found.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchStation();
  }, [stationuuid]);
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!station) return;
    if (isFavorite) {
      removeFavorite(station.stationuuid);
    } else {
      addFavorite(station.stationuuid);
    }
  };
  const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number | null | undefined }) => {
    if (!value) return null;
    return (
      <div className="flex items-center gap-3 text-lg">
        <Icon className="w-6 h-6 text-retro-secondary" />
        <span className="font-mono text-retro-accent/80">{label}:</span>
        <span className="font-mono font-bold text-retro-accent truncate">{value}</span>
      </div>
    );
  };
  const jsonLd = station ? {
    "@context": "https://schema.org",
    "@type": "BroadcastService",
    "name": station.name,
    "description": `Listen to ${station.name}, an online radio station from ${station.country}. Genres: ${station.tags}.`,
    "broadcastDisplayName": station.name,
    "provider": {
      "@type": "Organization",
      "name": "PixelPop FM"
    },
    "areaServed": {
      "@type": "Country",
      "name": station.country
    }
  } : null;
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          {isLoading && <StationDetailSkeleton />}
          {error && (
            <div className="flex flex-col items-center justify-center text-center py-16 bg-retro-background/50 border border-red-500/50 p-8">
              <AlertTriangle className="w-16 h-16 text-red-400 mb-4" />
              <h2 className="font-pixel text-2xl text-red-400 mb-2">Error Fetching Station</h2>
              <p className="text-retro-accent/80 max-w-md">{error}</p>
              <Link to="/" className="mt-6 font-mono text-retro-primary hover:underline">Back to Home</Link>
            </div>
          )}
          {!isLoading && !error && station && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <Helmet>
                <title>{`Listen to ${station.name} - PixelPop FM`}</title>
                <meta name="description" content={`Stream ${station.name} live. An online radio station from ${station.country} featuring ${station.tags}. Tune in on PixelPop FM.`} />
                {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
              </Helmet>
              <div className="flex items-center text-lg text-retro-accent/80 mb-4">
                <Link to="/" className="hover:text-retro-primary">Home</Link>
                <ChevronRight className="h-5 w-5 mx-1" />
                <span className="text-retro-accent truncate">{station.name}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                <div className="md:col-span-1">
                  <img
                    src={station.favicon || '/favicon.ico'}
                    alt={station.name}
                    className="w-full aspect-square object-cover border-4 border-retro-secondary shadow-glow"
                    onError={(e) => { e.currentTarget.src = '/favicon.ico'; }}
                  />
                </div>
                <div className="md:col-span-2">
                  <h1 className="font-pixel text-4xl md:text-5xl text-retro-primary mb-2">{station.name}</h1>
                  <p className="text-lg text-retro-accent/80 mb-8">{station.tags.split(',').join(', ')}</p>
                  <div className="flex items-center gap-4 mb-8">
                    <Button onClick={() => playStation(station)} size="lg" className="font-pixel text-xl bg-retro-primary hover:bg-retro-primary/80 text-retro-background px-8 py-6 flex items-center gap-3">
                      {isPlaying ? <><Pause className="w-6 h-6" /> Playing</> : <><Play className="w-6 h-6" /> Play Now</>}
                    </Button>
                    <Button onClick={handleToggleFavorite} variant="ghost" size="icon" className="w-14 h-14 border-2 border-retro-secondary/50 hover:border-retro-secondary hover:shadow-glow-sm">
                      <Star className={cn("w-8 h-8 text-retro-secondary transition-colors", isFavorite && "fill-current text-retro-secondary")} />
                    </Button>
                  </div>
                  <div className="space-y-4 border-t-2 border-retro-primary/30 pt-6">
                    <InfoItem icon={Globe} label="Country" value={station.country} />
                    <InfoItem icon={Radio} label="Codec" value={`${station.codec} @ ${station.bitrate}kbps`} />
                    <InfoItem icon={Heart} label="Votes" value={station.votes} />
                    <InfoItem icon={Tag} label="Language" value={station.language} />
                    {station.homepage && (
                       <div className="flex items-center gap-3 text-lg">
                        <BarChart2 className="w-6 h-6 text-retro-secondary" />
                        <span className="font-mono text-retro-accent/80">Homepage:</span>
                        <a href={station.homepage} target="_blank" rel="noopener noreferrer" className="font-mono font-bold text-retro-primary hover:underline truncate">{station.homepage}</a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}