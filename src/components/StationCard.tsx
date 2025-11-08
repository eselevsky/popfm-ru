import type { RadioStation } from '@shared/types';
import { useFavoritesStore } from '@/store/favoritesStore';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { translateCountry } from '@/lib/localization';
interface StationCardProps {
  station: RadioStation;
}
export function StationCard({ station }: StationCardProps) {
  const favorites = useFavoritesStore(s => s.favorites);
  const addFavorite = useFavoritesStore(s => s.addFavorite);
  const removeFavorite = useFavoritesStore(s => s.removeFavorite);
  const isFavorite = favorites.includes(station.stationuuid);
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation(); // Prevent any other parent handlers
    if (isFavorite) {
      removeFavorite(station.stationuuid);
    } else {
      addFavorite(station.stationuuid);
    }
  };
  return (
    <Link to={`/station/${station.stationuuid}`}>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="group relative aspect-[4/3] bg-black/30 border-2 border-retro-primary/30 p-4 flex flex-col justify-between cursor-pointer overflow-hidden transition-all duration-300 hover:border-retro-secondary hover:shadow-glow"
      >
        <div className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-40 transition-opacity duration-300" style={{ backgroundImage: `url(${station.favicon})` }} />
        <div className="relative z-10 flex justify-between items-start">
          <div className="w-12 h-12 flex-shrink-0 border border-retro-secondary/50 bg-retro-background/50 flex items-center justify-center">
            <img
              src={station.favicon}
              alt={station.name}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <button onClick={handleToggleFavorite} className="z-20 p-1 text-retro-secondary/70 hover:text-retro-secondary">
            <Star className={cn("w-6 h-6 transition-all", isFavorite && "fill-current text-retro-secondary")} />
          </button>
        </div>
        <div className="relative z-10">
          <h3 className="font-pixel text-base text-retro-accent leading-tight line-clamp-2">{station.name}</h3>
          <p className="text-sm text-retro-secondary/80 mt-1 line-clamp-1">{translateCountry(station.country)}</p>
        </div>
      </motion.div>
    </Link>
  );
}