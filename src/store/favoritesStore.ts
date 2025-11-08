import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { api } from '@/lib/api-client';
import type { Favorites } from '@shared/types';
interface FavoritesState {
  userId: string | null;
  favorites: string[]; // array of stationuuids
  initialized: boolean;
  init: () => Promise<void>;
  addFavorite: (stationuuid: string) => Promise<void>;
  removeFavorite: (stationuuid: string) => Promise<void>;
}
const getUserId = (): string => {
  let userId = localStorage.getItem('pixelpop_userid');
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem('pixelpop_userid', userId);
  }
  return userId;
};
export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  userId: null,
  favorites: [],
  initialized: false,
  init: async () => {
    if (get().initialized) return;
    const userId = getUserId();
    set({ userId });
    try {
      const data = await api<Favorites>(`/api/favorites/${userId}`);
      set({ favorites: data.stationuuids || [], initialized: true });
    } catch (error) {
      // If user not found (404), it's a new user. Initialize with empty array.
      console.warn('Failed to fetch favorites, assuming new user:', error);
      set({ favorites: [], initialized: true });
    }
  },
  addFavorite: async (stationuuid) => {
    const { userId, favorites } = get();
    if (!userId || favorites.includes(stationuuid)) return;
    const oldFavorites = [...favorites];
    const newFavorites = [...favorites, stationuuid];
    set({ favorites: newFavorites });
    try {
      await api(`/api/favorites/${userId}`, {
        method: 'POST',
        body: JSON.stringify({ stationuuid }),
      });
    } catch (error) {
      console.error('Failed to add favorite:', error);
      // Revert state on failure
      set({ favorites: oldFavorites });
    }
  },
  removeFavorite: async (stationuuid) => {
    const { userId, favorites } = get();
    if (!userId || !favorites.includes(stationuuid)) return;
    const oldFavorites = [...favorites];
    const newFavorites = favorites.filter((id) => id !== stationuuid);
    set({ favorites: newFavorites });
    try {
      await api(`/api/favorites/${userId}`, {
        method: 'DELETE',
        body: JSON.stringify({ stationuuid }),
      });
    } catch (error) {
      console.error('Failed to remove favorite:', error);
      // Revert state on failure
      set({ favorites: oldFavorites });
    }
  },
}));
// Initialize the store once when the app loads.
useFavoritesStore.getState().init();