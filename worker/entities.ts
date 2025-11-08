import { Entity } from "./core-utils";
import type { Favorites } from "@shared/types";
// FAVORITES ENTITY: one DO instance per user
export class FavoritesEntity extends Entity<Favorites> {
  static readonly entityName = "favorites";
  static readonly initialState: Favorites = { userId: "", stationuuids: [] };
  async addFavorite(stationuuid: string): Promise<Favorites> {
    return this.mutate(s => {
      if (s.stationuuids.includes(stationuuid)) {
        return s; // Already exists, no change
      }
      return { ...s, stationuuids: [...s.stationuuids, stationuuid] };
    });
  }
  async removeFavorite(stationuuid: string): Promise<Favorites> {
    return this.mutate(s => {
      if (!s.stationuuids.includes(stationuuid)) {
        return s; // Doesn't exist, no change
      }
      return { ...s, stationuuids: s.stationuuids.filter(id => id !== stationuuid) };
    });
  }
}