import type { RadioStation } from '@shared/types';
import { usePlayerStore } from '@/store/playerStore';
import { motion } from 'framer-motion';
import { Play, Pause, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';
interface StationCardProps {
  station: RadioStation;
}
export function StationCard({ station }: StationCardProps) {
  const playStation = usePlayerStore((s) => s.playStation);
  const currentStation = usePlayerStore((s) => s.currentStation);
  const status = usePlayerStore((s) => s.status);
  const isPlaying = currentStation?.stationuuid === station.stationuuid && status === 'playing';
  const isLoading = currentStation?.stationuuid === station.stationuuid && status === 'loading';
  const handlePlay = () => {
    playStation(station);
  };
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      onClick={handlePlay}
      className="group relative aspect-[4/3] bg-black/30 border-2 border-retro-primary/30 p-4 flex flex-col justify-between cursor-pointer overflow-hidden transition-all duration-300 hover:border-retro-secondary hover:shadow-glow"
    >
      <div className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-40 transition-opacity duration-300" style={{ backgroundImage: `url(${station.favicon})` }} />
      <div className="relative z-10 flex justify-between items-start">
        <div className="w-12 h-12 flex-shrink-0 border border-retro-secondary/50 bg-retro-background/50 flex items-center justify-center">
          <img 
            src={station.favicon} 
            alt={station.name} 
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
        <div className="text-right">
          <p className="text-xs text-retro-secondary uppercase tracking-widest">{station.codec}</p>
          <p className="text-xs text-retro-secondary">{station.bitrate} kbps</p>
        </div>
      </div>
      <div className="relative z-10">
        <h3 className="font-pixel text-base text-retro-accent leading-tight line-clamp-2">{station.name}</h3>
        <p className="text-sm text-retro-secondary/80 mt-1 line-clamp-1">{station.country}</p>
      </div>
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
    </motion.div>
  );
}