import { create } from 'zustand';
import type { RadioStation } from '@shared/types';
export type PlayerStatus = 'playing' | 'paused' | 'stopped' | 'loading' | 'error';
interface PlayerState {
  currentStation: RadioStation | null;
  status: PlayerStatus;
  error: string | null;
  volume: number;
  isMuted: boolean;
  playStation: (station: RadioStation) => void;
  togglePlayPause: () => void;
  stop: () => void;
  setStatus: (status: PlayerStatus) => void;
  setError: (error: string | null) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
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
  playStation: (station) => {
    const { currentStation, status } = get();
    if (currentStation?.stationuuid === station.stationuuid && status === 'playing') {
      return;
    }
    set({ currentStation: station, status: 'loading', error: null });
  },
  togglePlayPause: () => {
    const { status } = get();
    if (status === 'playing') {
      set({ status: 'paused' });
    } else if (status === 'paused') {
      set({ status: 'loading' });
    }
  },
  stop: () => {
    set({ currentStation: null, status: 'stopped' });
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
}));