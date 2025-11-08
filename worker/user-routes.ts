import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad, notFound, isStr } from './core-utils';
import { FavoritesEntity } from "./entities";
const RADIO_API_BASE = 'https://de1.api.radio-browser.info/json';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // --- RADIO BROWSER API PROXY ---
  const radio = new Hono<{ Bindings: Env }>();
  // Fetch stations - supports various query params
  radio.get('/stations', async (c) => {
    const url = new URL(`${RADIO_API_BASE}/stations/search`);
    const searchParams = c.req.query();
    for (const key in searchParams) {
      url.searchParams.append(key, searchParams[key]);
    }
    if (!Object.keys(searchParams).length) {
      url.searchParams.append('limit', '100');
      url.searchParams.append('order', 'votes');
      url.searchParams.append('reverse', 'true');
      url.searchParams.append('hidebroken', 'true');
    }
    try {
      const response = await fetch(url.toString(), {
        headers: { 'User-Agent': 'PixelPopFM/1.0' }
      });
      if (!response.ok) return bad(c, `Radio API error: ${response.statusText}`);
      const data = await response.json();
      return ok(c, data);
    } catch (error) {
      console.error('Radio API fetch error:', error);
      return bad(c, 'Failed to fetch from Radio API');
    }
  });
  // Fetch a single station (or multiple) by UUID
  radio.get('/stations/byuuid/:uuids', async (c) => {
    const uuids = c.req.param('uuids');
    const url = new URL(`${RADIO_API_BASE}/stations/byuuid`);
    url.searchParams.append('uuids', uuids);
    try {
      const response = await fetch(url.toString(), {
        headers: { 'User-Agent': 'PixelPopFM/1.0' }
      });
      if (!response.ok) return bad(c, `Radio API error: ${response.statusText}`);
      const data = await response.json();
      return ok(c, data);
    } catch (error) {
      console.error('Radio API fetch by UUID error:', error);
      return bad(c, 'Failed to fetch from Radio API');
    }
  });
  // Fetch all tags
  radio.get('/tags', async (c) => {
    const url = new URL(`${RADIO_API_BASE}/tags`);
    const searchParams = c.req.query();
    for (const key in searchParams) {
      url.searchParams.append(key, searchParams[key]);
    }
    try {
      const response = await fetch(url.toString(), {
        headers: { 'User-Agent': 'PixelPopFM/1.0' }
      });
      if (!response.ok) return bad(c, `Radio API error: ${response.statusText}`);
      const data = await response.json();
      return ok(c, data);
    } catch (error) {
      return bad(c, 'Failed to fetch tags from Radio API');
    }
  });
  // Fetch all countries
  radio.get('/countries', async (c) => {
    const url = new URL(`${RADIO_API_BASE}/countries`);
    const searchParams = c.req.query();
    for (const key in searchParams) {
      url.searchParams.append(key, searchParams[key]);
    }
    try {
      const response = await fetch(url.toString(), {
        headers: { 'User-Agent': 'PixelPopFM/1.0' }
      });
      if (!response.ok) return bad(c, `Radio API error: ${response.statusText}`);
      const data = await response.json();
      return ok(c, data);
    } catch (error) {
      return bad(c, 'Failed to fetch countries from Radio API');
    }
  });
  app.route('/api/radio', radio);
  // --- FAVORITES API ---
  const favorites = new Hono<{ Bindings: Env }>();
  // Get user's favorites
  favorites.get('/:userId', async (c) => {
    const { userId } = c.req.param();
    if (!isStr(userId)) return bad(c, 'User ID is required');
    const favs = new FavoritesEntity(c.env, userId);
    if (!(await favs.exists())) {
      return notFound(c, 'User favorites not found');
    }
    const state = await favs.getState();
    return ok(c, state);
  });
  // Add a favorite station
  favorites.post('/:userId', async (c) => {
    const { userId } = c.req.param();
    if (!isStr(userId)) return bad(c, 'User ID is required');
    const { stationuuid } = await c.req.json<{ stationuuid: string }>();
    if (!isStr(stationuuid)) return bad(c, 'stationuuid is required');
    const favs = new FavoritesEntity(c.env, userId);
    if (!(await favs.exists())) {
      // Create if it doesn't exist
      await favs.save({ userId, stationuuids: [stationuuid] });
    } else {
      await favs.addFavorite(stationuuid);
    }
    return ok(c, await favs.getState());
  });
  // Remove a favorite station
  favorites.delete('/:userId', async (c) => {
    const { userId } = c.req.param();
    if (!isStr(userId)) return bad(c, 'User ID is required');
    const { stationuuid } = await c.req.json<{ stationuuid: string }>();
    if (!isStr(stationuuid)) return bad(c, 'stationuuid is required');
    const favs = new FavoritesEntity(c.env, userId);
    if (!(await favs.exists())) {
      return notFound(c, 'User favorites not found');
    }
    await favs.removeFavorite(stationuuid);
    return ok(c, await favs.getState());
  });
  app.route('/api/favorites', favorites);
}