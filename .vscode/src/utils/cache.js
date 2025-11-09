// Cache simple en memoria con TTL.
// Uso sugerido:
//   import { cacheGet, cacheSet } from '../utils/cache.js'
//   const key = `dashboard|${fecha_inicio}|${fecha_fin}`;
//   const entry = cacheGet(key);
//   if (entry) return res.json({ ...entry.data, meta: { cache: true, generated_at: new Date(entry.createdAt).toISOString(), ttl_ms: entry.expires - Date.now() } });
//   cacheSet(key, data, 60000);

const store = new Map();

export function cacheSet(key, data, ttlMs = 60000) {
  store.set(key, { data, expires: Date.now() + ttlMs, createdAt: Date.now() });
}

export function cacheGet(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    store.delete(key);
    return null;
  }
  return entry; // { data, createdAt, expires }
}

export function cacheClear(key) {
  if (key) {
    store.delete(key);
  } else {
    store.clear();
  }
}

export function cacheInfo() {
  return Array.from(store.entries()).map(([k, v]) => ({
    key: k,
    createdAt: v.createdAt,
    expires: v.expires,
    expiresInMs: v.expires - Date.now()
  }));
}

export default { cacheGet, cacheSet, cacheClear, cacheInfo };
