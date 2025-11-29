export type Experience = {
    id: string;
    company?: string;
    role?: string;
    start?: string;
    end?: string;
    bullets?: string[];
};

export type Education = {
    id: string;
    school?: string;
    degree?: string;
    start?: string;
    end?: string;
};

export type ResumeShape = {
    _id?: string;
    template?: 'modern' | 'classic' | 'clean';
    name?: string;
    title?: string;
    summary?: string;
    contact?: { email?: string; phone?: string; location?: string };
    experience?: Experience[];
    education?: Education[];
    skills?: string[];
    createdAt?: string;
    updatedAt?: string;
};
