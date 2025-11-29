export type ResumePayload = any;
async function callApi(path: string, opts: RequestInit = {}) {
    const res = await fetch(path, { credentials: 'include', headers: { 'Content-Type': 'application/json' }, ...opts });
    const status = res.status;
    const body = await res.text();
    try {
        return { status, ok: res.ok, data: body ? JSON.parse(body) : null };
    } catch {
        return { status, ok: res.ok, data: body };
    }
}

export async function fetchResume() {
    return callApi('/api/resume', { method: 'GET' });
}


export async function saveResume(payload: ResumePayload) {
    return callApi('/api/resume', { method: 'POST', body: JSON.stringify(payload) });
}
