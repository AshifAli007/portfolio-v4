type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

type CacheStore = Map<string, CacheEntry<unknown>>;

declare global {
  var __STRAVA_CACHE_STORE__: CacheStore | undefined;
}

const getStore = (): CacheStore => {
  if (!globalThis.__STRAVA_CACHE_STORE__) {
    globalThis.__STRAVA_CACHE_STORE__ = new Map<string, CacheEntry<unknown>>();
  }
  return globalThis.__STRAVA_CACHE_STORE__;
};

export const getCachedValue = <T>(key: string): T | undefined => {
  const entry = getStore().get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    getStore().delete(key);
    return undefined;
  }
  return entry.value as T;
};

export const setCachedValue = <T>(key: string, value: T, ttlMs: number): void => {
  getStore().set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
};

export const clearCachedValue = (key: string): void => {
  getStore().delete(key);
};
