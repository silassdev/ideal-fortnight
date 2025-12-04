import { createClient, RedisClientType } from 'redis';

declare global {
    var __global_redis_client__: RedisClientType | undefined;
}

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

export function getRedisClient(): RedisClientType {
    if (typeof globalThis !== 'undefined' && (globalThis as any).__global_redis_client__) {
        return (globalThis as any).__global_redis_client__;
    }

    const client: RedisClientType = createClient({ url: REDIS_URL });
    client.on('error', (err) => {
        console.error('Redis Client Error', err);
    });

    client.connect().catch((err) => {
        console.error('Redis connect error', err);
    });

    if (typeof globalThis !== 'undefined') {
        (globalThis as any).__global_redis_client__ = client;
    }
    return client;
}
