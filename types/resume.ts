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
    start?: string; // Legacy: for backward compatibility
    end?: string; // Legacy: for backward compatibility
    startMonth?: string; // e.g., "January", "February", etc.
    startYear?: string; // e.g., "2020"
    endMonth?: string;
    endYear?: string;
    current?: boolean; // If still working here
    bullets?: string[];
}

export interface Education {
    id: string;
    school?: string;
    degree?: string;
    start?: string; // Legacy
    end?: string; // Legacy
    startMonth?: string;
    startYear?: string;
    endMonth?: string;
    endYear?: string;
    current?: boolean;
    notes?: string;
}

export interface Section {
    type: string;
    title?: string;
    items?: any[];
}

export interface Project {
    id?: string;
    title?: string;
    description?: string;
    link?: string;
    tech?: string[];
    startMonth?: string;
    startYear?: string;
    endMonth?: string;
    endYear?: string;
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
    certifications?: string[];
    sections?: Section[];
    projects?: Project[];
    createdAt?: string;
    updatedAt?: string;
    [key: string]: any;
};

// Predefined skills list for quick selection
export const PREDEFINED_SKILLS = {
    frontend: [
        'React', 'Vue.js', 'Angular', 'Next.js', 'Svelte',
        'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Sass',
        'Tailwind CSS', 'Bootstrap', 'Material-UI', 'Redux', 'GraphQL'
    ],
    backend: [
        'Node.js', 'Python', 'Java', 'C#', 'PHP',
        'Ruby', 'Go', 'Rust', 'Express.js', 'Django',
        'Flask', 'Spring Boot', 'ASP.NET', 'Laravel', 'Rails'
    ],
    database: [
        'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'SQLite',
        'Firebase', 'DynamoDB', 'Cassandra', 'Oracle', 'SQL Server'
    ],
    devops: [
        'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud',
        'CI/CD', 'Jenkins', 'GitHub Actions', 'GitLab CI', 'Terraform',
        'Ansible', 'Nginx', 'Linux', 'Bash'
    ],
    tools: [
        'Git', 'VS Code', 'Figma', 'Jira', 'Postman',
        'Webpack', 'Vite', 'npm', 'Yarn', 'ESLint',
        'Jest', 'Cypress', 'Selenium', 'Chrome DevTools'
    ],
    mobile: [
        'React Native', 'Flutter', 'Swift', 'Kotlin',
        'iOS', 'Android', 'Expo', 'Xamarin'
    ],
    other: [
        'Agile', 'Scrum', 'REST API', 'Microservices',
        'WebSockets', 'OAuth', 'JWT', 'SEO', 'Accessibility',
        'Performance Optimization', 'Unit Testing', 'TDD'
    ]
};

// Helper to get all skills as a flat array
export const getAllPredefinedSkills = (): string[] => {
    return Object.values(PREDEFINED_SKILLS).flat().sort();
};

// Month options for dropdowns
export const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
