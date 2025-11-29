export type ResumePayload = any; // keep loose; use types/resume for strict typing

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

/**
 * Save: server should upsert by userId (one resume per user).
 * We call POST /api/resume and expect the saved resume in response.
 */
export async function saveResume(payload: ResumePayload) {
    return callApi('/api/resume', { method: 'POST', body: JSON.stringify(payload) });
}
