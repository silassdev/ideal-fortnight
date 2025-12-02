// src/types/resume.ts
// Define the shape of the resume object used by templates.

export interface Contact {
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  // any other contact channels you might store:
  twitter?: string;
  portfolio?: string;
  // allow additional keys if you expect arbitrary contact properties
  [key: string]: string | undefined;
}

export interface Experience {
  id?: string | number;
  role?: string;
  company?: string;
  location?: string;
  start?: string;
  end?: string;
  bullets?: string[];
}

export interface Education {
  id?: string | number;
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

export interface ResumeShape {
  name?: string;
  title?: string;
  summary?: string;
  contact?: Contact;
  skills?: string[];
  experience?: Experience[];
  education?: Education[];
  sections?: Section[];
  projects?: Project[];
  [key: string]: any;
}

export interface TemplateComponentProps {
  resume: ResumeShape;
  className?: string;
}
