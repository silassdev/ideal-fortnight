export interface Contact {
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
    [key: string]: string | undefined;
}

export interface Experience {
    id: string;
    company?: string;
    role?: string;
    location?: string;
    start?: string;
    end?: string;
    bullets?: string[];
}

export interface Education {
    id: string;
    school?: string;
    degree?: string;
    start?: string;
    end?: string;
    notes?: string;
}

export interface Section {
    type: string;
    title?: string;
    items?: any[];
}

export interface Project {
    title?: string;
    description?: string;
    link?: string;
    tech?: string[];
}

export type ResumeShape = {
    _id?: string;
    publicId?: string;
    template?: string;
    name?: string;
    title?: string;
    summary?: string;
    contact?: Contact;
    experience?: Experience[];
    education?: Education[];
    skills?: string[];
    sections?: Section[];
    projects?: Project[];
    createdAt?: string;
    updatedAt?: string;
    [key: string]: any;
};
