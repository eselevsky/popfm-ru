// Force rebuild
import { useEffect, useRef } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { Play, Pause, StopCircle, Loader, AlertTriangle, Volume2, Volume1, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
export function RadioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentStation = usePlayerStore((s) => s.currentStation);
  const status = usePlayerStore((s) => s.status);
  const error = usePlayerStore((s) => s.error);
  const volume = usePlayerStore((s) => s.volume);
  const isMuted = usePlayerStore((s) => s.isMuted);
  const setStatus = usePlayerStore((s) => s.setStatus);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const toggleMute = usePlayerStore((s) => s.toggleMute);
  const togglePlayPause = usePlayerStore((s) => s.togglePlayPause);
  const stop = usePlayerStore((s) => s.stop);
  const handlePlaybackError = usePlayerStore((s) => s.handlePlaybackError);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handlePlay = () => setStatus('playing');
    const handlePause = () => {
      // Only set to paused if it wasn't an intentional stop
      if (usePlayerStore.getState().status !== 'stopped') {
        setStatus('paused');
      }
    };
    const handleError = () => {
      console.error('Audio Error:', audio.error);
      handlePlaybackError();
    };
    const handleStalled = () => setStatus('loading');
    const handleCanPlay = () => {
      if (usePlayerStore.getState().status === 'loading') {
        audio.play().catch(e => {
          console.error("Autoplay failed on canplay:", e);
          // The error event will be caught by handleError if it's a real issue
        });
      }
    };
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);
    audio.addEventListener('stalled', handleStalled);
    audio.addEventListener('canplay', handleCanPlay);
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('stalled', handleStalled);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [setStatus, handlePlaybackError]);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (status === 'loading' && currentStation) {
      audio.src = currentStation.url_resolved;
      audio.load();
      audio.play().catch((e) => {
        console.error("Initial play() failed:", e);
        // The 'error' event listener will handle this failure and trigger the fallback.
      });
    } else if (status === 'paused') {
      audio.pause();
    } else if (status === 'stopped') {
      audio.pause();
      audio.src = '';
    }
  }, [status, currentStation]);
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      audio.muted = isMuted;
    }
  }, [volume, isMuted]);
  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  return (
    <>
      <audio ref={audioRef} preload="none" />
      <AnimatePresence>
        {currentStation && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 h-28 md:h-20 bg-retro-background/80 backdrop-blur-md border-t-2 border-retro-primary/50 shadow-glow z-50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 py-2 md:py-0">
              {/* Station Info (Top row on mobile, left side on desktop) */}
              <div className="flex items-center gap-4 overflow-hidden flex-1 pt-1 md:pt-0">
                <img
                  src={currentStation.favicon || '/favicon.ico'}
                  alt={currentStation.name}
                  className="w-10 h-10 md:w-12 md:h-12 object-cover border-2 border-retro-secondary flex-shrink-0"
                  onError={(e) => { e.currentTarget.src = '/favicon.ico'; }}
                />
                <div className="flex-1 overflow-hidden">
                  <p className="text-base md:text-lg font-pixel text-retro-accent truncate">{currentStation.name}</p>
                  <p className="text-sm text-retro-secondary truncate">
                    {status === 'loading' && error ? error : currentStation.country}
                  </p>
                </div>
              </div>
              {/* Controls (Bottom row on mobile, right side on desktop) */}
              <div className="flex items-center justify-between md:justify-end gap-2 md:gap-4 w-full md:w-auto">
                {status === 'error' && (
                  <div className="hidden md:flex items-center gap-2 text-red-400">
                    <AlertTriangle size={20} />
                    <span className="hidden md:inline text-sm">{error || 'Ошибка воспроизведения'}</span>
                  </div>
                )}
                <div className="hidden md:flex items-center gap-2 w-32">
                  <Button onClick={toggleMute} variant="ghost" size="icon" className="w-10 h-10 text-retro-secondary hover:text-retro-accent">
                    <VolumeIcon size={24} />
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    onValueChange={(value) => setVolume(value[0] / 100)}
                    max={100}
                    step={1}
                    className={cn('w-full')}
                  />
                </div>
                <div className="flex items-center justify-between w-full md:w-auto md:justify-start gap-2">
                  <Button onClick={toggleMute} variant="ghost" size="icon" className="md:hidden w-12 h-12 text-retro-secondary hover:text-retro-accent">
                    <VolumeIcon size={28} />
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button onClick={togglePlayPause} variant="ghost" size="icon" className="w-12 h-12 text-retro-secondary hover:text-retro-accent hover:bg-retro-primary/20">
                      {status === 'loading' && <Loader className="animate-spin" />}
                      {status === 'playing' && <Pause size={28} />}
                      {(status === 'paused' || status === 'stopped' || status === 'error') && <Play size={28} />}
                    </Button>
                    <Button onClick={stop} variant="ghost" size="icon" className="w-12 h-12 text-retro-primary hover:text-retro-accent hover:bg-retro-primary/20">
                      <StopCircle size={28} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}