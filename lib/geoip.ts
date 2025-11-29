import geoip from 'geoip-lite';

export type GeoInfo = {
    ip: string;
    country?: string | null;
    region?: string | null;
    city?: string | null;
    ll?: [number, number] | null;
    metro?: number | null;
    timezone?: string | null;
    raw?: any;
} | null;

/**
 * Extract client IP from a Request (App Router).
 */
export function getClientIpFromRequest(req: Request): string | null {
    try {
        const headers = new Headers(req.headers as any);
        const candidates = [
            headers.get('x-forwarded-for'),
            headers.get('x-real-ip'),
            headers.get('cf-connecting-ip'),
            headers.get('x-vercel-forwaded-for'),
            headers.get('x-vercel-forwarded-for'),
            headers.get('x-client-ip'),
            headers.get('x-forwarded'),
            headers.get('forwarded-for'),
            headers.get('forwarded'),
        ];

        for (const c of candidates) {
            if (c && typeof c === 'string') {
                const ip = c.split(',')[0].trim();
                if (ip) return ip;
            }
        }

        // fallback: host portion of URL (not ideal)
        const url = new URL(req.url);
        if (url.hostname) return url.hostname;
    } catch (e) {
        // ignore
    }
    return null;
}

/**
 * Look up geo metadata for an IP using geoip-lite.
 */
export function lookupIp(ip: string | null): GeoInfo {
    if (!ip) return null;

    // strip port if present (common when dev uses ip:port)
    const normalized = ip.includes(':') && ip.split(':').length > 1 && ip.includes('.') ? ip.split(':')[0] : ip;
    const geo = geoip.lookup(normalized);
    if (!geo) return null;

    return {
        ip: normalized,
        country: geo.country || null,
        region: geo.region || null,
        city: geo.city || null,
        ll: (geo.ll as [number, number]) || null,
        metro: (geo as any).metro ?? null,
        timezone: (geo as any).timezone ?? null,
        raw: geo,
    };
}
