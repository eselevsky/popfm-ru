import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad } from './core-utils';
const RADIO_API_BASE = 'http://de2.api.radio-browser.info/json';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // --- RADIO BROWSER API PROXY ---
  const radio = new Hono<{ Bindings: Env }>();
  // Fetch stations - supports various query params
  radio.get('/stations', async (c) => {
    const url = new URL(`${RADIO_API_BASE}/stations/search`);
    const searchParams = c.req.query();
    // Forward all query params from the client request
    for (const key in searchParams) {
      url.searchParams.append(key, searchParams[key]);
    }
    // Default to top 100 by votes if no params
    if (url.searchParams.toString() === '') {
      url.searchParams.append('limit', '100');
      url.searchParams.append('order', 'votes');
      url.searchParams.append('reverse', 'true');
    }
    try {
      const response = await fetch(url.toString(), {
        headers: { 'User-Agent': 'PixelPopFM/1.0' }
      });
      if (!response.ok) {
        return bad(c, `Radio API error: ${response.statusText}`);
      }
      const data = await response.json();
      return ok(c, data);
    } catch (error) {
      console.error('Radio API fetch error:', error);
      return bad(c, 'Failed to fetch from Radio API');
    }
  });
  // Fetch all tags
  radio.get('/tags', async (c) => {
    try {
      const response = await fetch(`${RADIO_API_BASE}/tags`, {
        headers: { 'User-Agent': 'PixelPopFM/1.0' }
      });
      if (!response.ok) {
        return bad(c, `Radio API error: ${response.statusText}`);
      }
      const data = await response.json();
      return ok(c, data);
    } catch (error) {
      return bad(c, 'Failed to fetch tags from Radio API');
    }
  });
  // Fetch all countries
  radio.get('/countries', async (c) => {
    try {
      const response = await fetch(`${RADIO_API_BASE}/countries`, {
        headers: { 'User-Agent': 'PixelPopFM/1.0' }
      });
      if (!response.ok) {
        return bad(c, `Radio API error: ${response.statusText}`);
      }
      const data = await response.json();
      return ok(c, data);
    } catch (error) {
      return bad(c, 'Failed to fetch countries from Radio API');
    }
  });
  app.route('/api/radio', radio);
}