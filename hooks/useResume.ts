// hooks/useResume.ts
'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchResume, saveResume as apiSave } from '@/lib/resumeClient';
import { ResumeShape } from '@/types/resume';

type Hook = {
    resume: ResumeShape | null;
    setResume: (r: ResumeShape) => void;
    isLoading: boolean;
    saveResume: (r?: ResumeShape) => Promise<void>;
};

export default function useResume(): Hook {
    const [resume, setResumeState] = useState<ResumeShape | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            setIsLoading(true);
            const res = await fetchResume();
            if (!mounted) return;
            if (res.ok && res.data) setResumeState(res.data);
            else setResumeState(null);
            setIsLoading(false);
        })();
        return () => {
            mounted = false;
        };
    }, []);

    const setResume = useCallback((r: ResumeShape) => {
        setResumeState(r);
    }, []);

    const saveResume = useCallback(async (r?: ResumeShape) => {
        const payload = r ?? resume;
        if (!payload) return;
        // optimistic UI: assume success
        setResumeState(payload);
        const res = await apiSave(payload);
        if (res.ok && res.data) {
            setResumeState(res.data);
        } else {
            // on failure, optionally reload from server or notify user
            console.error('Failed to save resume', res);
        }
    }, [resume]);

    return { resume, setResume, isLoading, saveResume };
}
