import { getRedisClient } from '@/lib/redis';

const client = getRedisClient();

/**
 * getOrSet JSON-serialised cache helper.
 *
 * @param key cache key
 * @param ttlSeconds TTL in seconds
 * @param fetcher async function to compute value when cache miss
 */
export async function getOrSet<T>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> {
    try {
        const raw = await client.get(key);
        if (raw) {
            try {
                return JSON.parse(raw) as T;
            } catch (e) {
                // fallthrough to refresh cache
            }
        }

        const value = await fetcher();
        try {
            await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
        } catch (e) {

            console.warn('cache set failed', e);
        }
        return value;
    } catch (err) {
        // If redis is down, fallback to fetching fresh
        // eslint-disable-next-line no-console
        console.warn('Redis getOrSet error, fetching fresh', err);
        return fetcher();
    }
}

export async function del(key: string): Promise<void> {
    try {
        await client.del(key);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Redis del error', err);
    }
}

/** convenience: invalidate multiple keys */
export async function delMany(keys: string[]): Promise<void> {
    try {
        if (keys.length === 0) return;
        await client.del(keys);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Redis delMany error', err);
    }
}
