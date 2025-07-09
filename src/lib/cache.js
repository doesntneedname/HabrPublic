import fs from 'fs/promises';
import { DateTime } from 'luxon';

const CACHE_FILE = 'cache.json';

let cache = [];

export async function loadCache() {
  try {
    cache = JSON.parse(await fs.readFile(CACHE_FILE, 'utf8'));
  } catch {
    cache = [];
  }
  return cache;
}

export async function updateCache(newItems) {
  const todayIds = newItems
    .filter(a => isToday(a.created_at))
    .map(a => a.id);
  cache = [...new Set([...cache, ...todayIds])];
  await fs.writeFile(CACHE_FILE, JSON.stringify(cache));
}

export async function clearCache() {
  cache = [];
  await fs.writeFile(CACHE_FILE, JSON.stringify([]));
  console.log('Cache cleared');
}

function isToday(date) {
  const msk = DateTime.fromISO(date, { zone: 'UTC' }).setZone('Europe/Moscow');
  return msk.hasSame(DateTime.now().setZone('Europe/Moscow'), 'day');
}
