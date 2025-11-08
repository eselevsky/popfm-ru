import { create } from 'zustand';
import type { RadioStation } from '@shared/types';
export type PlayerStatus = 'playing' | 'paused' | 'stopped' | 'loading' | 'error';
interface PlayerState {
  currentStation: RadioStation | null;
  status: PlayerStatus;
  error: string | null;
  playStation: (station: RadioStation) => void;
  togglePlayPause: () => void;
  stop: () => void;
  setStatus: (status: PlayerStatus) => void;
  setError: (error: string | null) => void;
}
export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentStation: null,
  status: 'stopped',
  error: null,
  playStation: (station) => {
    const { currentStation, status } = get();
    // If it's the same station and it's already playing, do nothing.
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
}));