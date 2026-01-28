import { ResumeShape } from '../../../types/resume';
import { renderStarterHTML } from './starter';

export type HTMLTemplateRenderer = (data: ResumeShape) => string;

const templates: Record<string, HTMLTemplateRenderer> = {
    starter: renderStarterHTML,
    // Add more templates as they are refactored
};

export function getHTMLTemplate(templateName: string, data: ResumeShape): string {
    const renderer = templates[templateName] || renderStarterHTML; // Fallback to starter
    return renderer(data);
}
