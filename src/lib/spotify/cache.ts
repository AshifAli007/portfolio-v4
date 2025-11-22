const cache = new Map<string, { expires: number; value: unknown }>();

export function setCached<T>(key: string, value: T, ttlMs: number): T {
  cache.set(key, { value, expires: Date.now() + ttlMs });
  return value;
}

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  return entry.value as T;
}

export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}
