/**
 * In-memory cache implementation (no Redis required).
 * This is a simple fallback for development when Redis is not available.
 */

type CacheEntry<T> = {
    value: T;
    expiresAt: number;
};

const memoryCache = new Map<string, CacheEntry<unknown>>();

/**
 * getOrSet JSON-serialised cache helper.
 *
 * @param key cache key
 * @param ttlSeconds TTL in seconds
 * @param fetcher async function to compute value when cache miss
 */
export async function getOrSet<T>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> {
    const now = Date.now();
    const cached = memoryCache.get(key) as CacheEntry<T> | undefined;

    if (cached && cached.expiresAt > now) {
        return cached.value;
    }

    const value = await fetcher();
    memoryCache.set(key, {
        value,
        expiresAt: now + ttlSeconds * 1000,
    });
    return value;
}

export async function del(key: string): Promise<void> {
    memoryCache.delete(key);
}

/** convenience: invalidate multiple keys */
export async function delMany(keys: string[]): Promise<void> {
    for (const key of keys) {
        memoryCache.delete(key);
    }
}
