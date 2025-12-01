export function getBaseUrl(): string {
    const publicBase = process.env.NEXT_PUBLIC_BASE_URL;
    if (publicBase) return stripTrailingSlash(publicBase);

    const nextAuthUrl = process.env.NEXTAUTH_URL;
    if (nextAuthUrl) return stripTrailingSlash(nextAuthUrl);

    const vercelUrl = process.env.VERCEL_URL;
    if (vercelUrl) {
        const host = stripTrailingSlash(vercelUrl);
        return host.startsWith('http') ? host : `https://${host}`;
    }

    const port = process.env.PORT ?? '3000';
    return `http://localhost:${port}`;
}

function stripTrailingSlash(u: string) {
    return u.endsWith('/') ? u.slice(0, -1) : u;
}
