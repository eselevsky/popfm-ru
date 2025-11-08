import { useEffect, useRef } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { Play, Pause, StopCircle, Loader, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
export function RadioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentStation = usePlayerStore((s) => s.currentStation);
  const status = usePlayerStore((s) => s.status);
  const error = usePlayerStore((s) => s.error);
  const setStatus = usePlayerStore((s) => s.setStatus);
  const setError = usePlayerStore((s) => s.setError);
  const togglePlayPause = usePlayerStore((s) => s.togglePlayPause);
  const stop = usePlayerStore((s) => s.stop);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handlePlay = () => setStatus('playing');
    const handlePause = () => setStatus('paused');
    const handleError = () => {
      console.error('Audio Error:', audio.error);
      setError(`Playback error: ${audio.error?.message || 'Unknown error'}`);
    };
    const handleStalled = () => setStatus('loading');
    const handleCanPlay = () => {
      if (status === 'loading') {
        audio.play().catch(handleError);
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
  }, [setStatus, setError, status]);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (status === 'loading' && currentStation) {
      audio.src = currentStation.url_resolved;
      audio.load();
      audio.play().catch((e) => {
        console.error("Autoplay failed:", e);
        setError("Autoplay prevented. Click play to start.");
      });
    } else if (status === 'paused') {
      audio.pause();
    } else if (status === 'stopped') {
      audio.pause();
      audio.src = '';
    }
  }, [status, currentStation, setError]);
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
            className="fixed bottom-0 left-0 right-0 h-20 bg-retro-background/80 backdrop-blur-md border-t-2 border-retro-primary/50 shadow-glow z-50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
              <div className="flex items-center gap-4 overflow-hidden">
                <img
                  src={currentStation.favicon || '/favicon.ico'}
                  alt={currentStation.name}
                  className="w-12 h-12 object-cover border-2 border-retro-secondary"
                  onError={(e) => { e.currentTarget.src = '/favicon.ico'; }}
                />
                <div className="flex-1 overflow-hidden">
                  <p className="text-lg font-pixel text-retro-accent truncate">{currentStation.name}</p>
                  <p className="text-sm text-retro-secondary truncate">{currentStation.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertTriangle size={20} />
                    <span className="hidden md:inline text-sm">{error || 'Playback Error'}</span>
                  </div>
                )}
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}