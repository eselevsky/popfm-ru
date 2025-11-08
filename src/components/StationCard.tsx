import type { RadioStation } from '@shared/types';
import { usePlayerStore } from '@/store/playerStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import { motion } from 'framer-motion';
import { Play, Pause, Radio, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
interface StationCardProps {
  station: RadioStation;
}
export function StationCard({ station }: StationCardProps) {
  const navigate = useNavigate();
  const playStation = usePlayerStore((s) => s.playStation);
  const currentStation = usePlayerStore((s) => s.currentStation);
  const status = usePlayerStore((s) => s.status);
  const favorites = useFavoritesStore(s => s.favorites);
  const addFavorite = useFavoritesStore(s => s.addFavorite);
  const removeFavorite = useFavoritesStore(s => s.removeFavorite);
  const isPlaying = currentStation?.stationuuid === station.stationuuid && status === 'playing';
  const isLoading = currentStation?.stationuuid === station.stationuuid && status === 'loading';
  const isFavorite = favorites.includes(station.stationuuid);
  const handleCardClick = (e: React.MouseEvent) => {
    // If the click is on a link or button, let their own onClick handle it.
    if ((e.target as HTMLElement).closest('a, button')) {
      return;
    }
    playStation(station);
  };
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from firing
    if (isFavorite) {
      removeFavorite(station.stationuuid);
    } else {
      addFavorite(station.stationuuid);
    }
  };
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group relative aspect-[4/3] bg-black/30 border-2 border-retro-primary/30 p-4 flex flex-col justify-between cursor-pointer overflow-hidden transition-all duration-300 hover:border-retro-secondary hover:shadow-glow"
      onClick={handleCardClick}
    >
      <div className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-40 transition-opacity duration-300" style={{ backgroundImage: `url(${station.favicon})` }} />
      <div className="relative z-10 flex justify-between items-start">
        <Link to={`/station/${station.stationuuid}`} className="w-12 h-12 flex-shrink-0 border border-retro-secondary/50 bg-retro-background/50 flex items-center justify-center hover:scale-105 transition-transform">
          <img
            src={station.favicon}
            alt={station.name}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </Link>
        <button onClick={handleToggleFavorite} className="z-20 p-1 text-retro-secondary/70 hover:text-retro-secondary">
          <Star className={cn("w-6 h-6 transition-all", isFavorite && "fill-current text-retro-secondary")} />
        </button>
      </div>
      <div className="relative z-10">
        <Link to={`/station/${station.stationuuid}`} className="hover:underline">
          <h3 className="font-pixel text-base text-retro-accent leading-tight line-clamp-2">{station.name}</h3>
        </Link>
        <p className="text-sm text-retro-secondary/80 mt-1 line-clamp-1">{station.country}</p>
      </div>
      {/* 
      <div className={cn(
        "absolute inset-0 bg-retro-background/80 flex items-center justify-center transition-opacity duration-300",
        isPlaying || isLoading ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      )}>
        {isLoading ? (
          <Radio className="w-16 h-16 text-retro-secondary animate-pulse" />
        ) : isPlaying ? (
          <Pause className="w-16 h-16 text-retro-primary" />
        ) : (
          <Play className="w-16 h-16 text-retro-accent" />
        )}
      </div> 
      */}
    </motion.div>
  );
}