export type ApiResult<T = any> = {
    ok: boolean;
    status: number;
    data?: T;
    error?: string;
};

async function callApi<T = any>(path: string, opts: RequestInit = {}): Promise<ApiResult<T>> {
    try {
        const res = await fetch(path, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
            ...opts,
        });

        const status = res.status;
        const text = await res.text();
        let json: any = null;
        try { json = text ? JSON.parse(text) : null; } catch (e) { json = { message: text }; }

        if (!res.ok) return { ok: false, status, error: json?.message || json?.error || res.statusText };
        return { ok: true, status, data: json };
    } catch (err: any) {
        return { ok: false, status: 0, error: err?.message || 'Network error' };
    }
}

export async function registerUser(payload: { name?: string; email: string; password: string }) {
    return callApi('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) });
}

export async function loginUser(payload: { email: string; password: string }) {
    return callApi('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) });
}
