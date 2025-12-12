import fetch from 'node-fetch';

export type Suggestion = {
    templateKey: string;
    reason: string;
    starter: { name?: string; title?: string; summary?: string; skills?: string[]; experience?: any[] };
};

const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'text-bison@001';
const BASE_URL = process.env.GEMINI_ENDPOINT || `https://us-central1-aiplatform.googleapis.com/v1`; // adjust if needed

function heuristicSuggest(details: any): Suggestion {
    // simple heuristic: if domain contains "design" choose 'apela', if engineering choose 'modern'
    const allText = JSON.stringify(details).toLowerCase();
    const isDesign = allText.includes('design') || allText.includes('ux') || allText.includes('ui');
    const isEngineering = allText.includes('engineer') || allText.includes('developer') || allText.includes('software');
    const isSenior = allText.includes('senior') || allText.includes('lead') || allText.includes('manager');

    const templateKey = isDesign ? 'apela' : isEngineering ? (isSenior ? 'pro-tech' : 'modern') : 'apela';
    const reason = `Heuristic chose ${templateKey} based on detected keywords.`;
    const starter = {
        name: details.name || '',
        title: details.title || (isSenior ? 'Senior Professional' : 'Professional'),
        summary: details.summary || `Experienced ${isDesign ? 'product designer' : isEngineering ? 'software developer' : 'professional'} with demonstrable results.`,
        skills: details.skills || [],
        experience: details.experience || [],
    };

    return { templateKey, reason, starter };
}

export async function suggestTemplateWithGemini(details: any): Promise<Suggestion> {
    // if no API KEY, fallback to heuristic
    if (!process.env.GEMINI_API_KEY) return heuristicSuggest(details);

    // Build a prompt that requests template key + explanation + starter plate
    const prompt = `You are a helpful assistant that recommends a resume template key and a starter resume plate (name, title, short summary, and key skills / experiences)
Given applicant details: ${JSON.stringify(details)}
Output a JSON object: { "templateKey": "<one-word-key>", "reason":"<why>", "starter": { "name":"", "title":"", "summary":"", "skills":[...], "experience":[...] } }
`;

    // Vertex AI text generation REST endpoint (example)
    const project = process.env.GEMINI_PROJECT;
    const location = process.env.GEMINI_LOCATION || 'us-central1';
    const model = DEFAULT_MODEL;
    const url = project
        ? `${BASE_URL}/projects/${project}/locations/${location}/publishers/google/models/${model}:predict`
        : `${BASE_URL}/models/${model}:predict`;

    const body: any = {
        instances: [{ prompt }],
        parameters: { temperature: 0.3, candidateCount: 1 },
    };

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
            },
            body: JSON.stringify(body),
        });
        const json = await res.json();

        // Attempt to extract text output heuristically
        const text = json?.predictions?.[0]?.content?.[0]?.text || json?.predictions?.[0]?.candidates?.[0]?.content?.[0]?.text || json?.predictions?.[0]?.output || JSON.stringify(json);
        // try parse JSON from text
        try {
            const parsed = JSON.parse(text);
            return parsed as Suggestion;
        } catch {
            // if not JSON, try to extract JSON substring
            const m = text.match(/\{[\s\S]*\}/);
            if (m) {
                try { return JSON.parse(m[0]) as Suggestion; } catch { }
            }
            // fallback to heuristic
            return heuristicSuggest(details);
        }
    } catch (err) {
        // on any network / API error fallback
        return heuristicSuggest(details);
    }
}
