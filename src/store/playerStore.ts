import { create } from 'zustand';
import type { RadioStation } from '@shared/types';
import { api } from '@/lib/api-client';
export type PlayerStatus = 'playing' | 'paused' | 'stopped' | 'loading' | 'error';
interface PlayerState {
  currentStation: RadioStation | null;
  status: PlayerStatus;
  error: string | null;
  volume: number;
  isMuted: boolean;
  stationQueue: RadioStation[];
  currentQueueIndex: number;
  playStation: (station: RadioStation) => void;
  togglePlayPause: () => void;
  stop: () => void;
  setStatus: (status: PlayerStatus) => void;
  setError: (error: string | null) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  handlePlaybackError: () => Promise<void>;
}
const getInitialVolume = (): number => {
  try {
    const storedVolume = localStorage.getItem('popfm_volume');
    if (storedVolume) {
      const volume = parseFloat(storedVolume);
      if (!isNaN(volume) && volume >= 0 && volume <= 1) {
        return volume;
      }
    }
  } catch (error) {
    console.error("Could not read volume from localStorage", error);
  }
  return 1;
};
export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentStation: null,
  status: 'stopped',
  error: null,
  volume: getInitialVolume(),
  isMuted: false,
  stationQueue: [],
  currentQueueIndex: 0,
  playStation: (station) => {
    const { currentStation, status } = get();
    if (currentStation?.stationuuid === station.stationuuid) {
      if (status === 'playing' || status === 'loading') {
        return; // Do nothing if it's already playing or loading
      }
      if (status === 'paused') {
        set({ status: 'playing' }); // Resume if paused
        return;
      }
    }
    // For a new station, or a stopped/error one, start playback
    set({
      currentStation: station,
      status: 'loading',
      error: null,
      stationQueue: [station],
      currentQueueIndex: 0,
    });
  },
  togglePlayPause: () => {
    const { status } = get();
    if (status === 'playing') {
      set({ status: 'paused' });
    } else if (status === 'paused') {
      set({ status: 'playing' });
    }
  },
  stop: () => {
    set({ 
      currentStation: null, 
      status: 'stopped',
      stationQueue: [],
      currentQueueIndex: 0,
      error: null,
    });
  },
  setStatus: (status) => {
    set({ status });
  },
  setError: (error) => {
    set({ status: 'error', error });
  },
  setVolume: (volume) => {
    const newVolume = Math.max(0, Math.min(1, volume));
    set({ volume: newVolume, isMuted: newVolume === 0 });
    try {
      localStorage.setItem('popfm_volume', String(newVolume));
    } catch (error) {
      console.error("Could not save volume to localStorage", error);
    }
  },
  toggleMute: () => {
    set((state) => ({ isMuted: !state.isMuted }));
  },
  handlePlaybackError: async () => {
    const { stationQueue, currentQueueIndex, currentStation } = get();
    if (!currentStation) return;
    // On first error for this station, fetch alternatives
    if (currentQueueIndex === 0 && stationQueue.length === 1) {
      try {
        const alternatives = await api<RadioStation[]>(`/api/radio/stations?name=${encodeURIComponent(currentStation.name)}&hidebroken=true&limit=5`);
        const newQueue = [
          currentStation, 
          ...alternatives.filter(s => s.stationuuid !== currentStation.stationuuid)
        ];
        set({ stationQueue: newQueue });
      } catch (apiError) {
        console.error("Failed to fetch alternative stations:", apiError);
        // Proceed without alternatives
      }
    }
    const nextIndex = get().currentQueueIndex + 1;
    const currentQueue = get().stationQueue;
    if (nextIndex < currentQueue.length) {
      const nextStation = currentQueue[nextIndex];
      set({
        currentQueueIndex: nextIndex,
        currentStation: nextStation,
        status: 'loading',
        error: `Поток #${nextIndex} недоступен, пробую следующий...`,
      });
    } else {
      set({
        status: 'error',
        error: 'Все доступные потоки для этой станции не работают.',
        stationQueue: [],
        currentQueueIndex: 0,
      });
    }
  },
}));