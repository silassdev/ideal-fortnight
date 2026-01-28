import { ResumeShape } from '../../../types/resume';
import { renderStarterHTML } from './starter';
import { renderSilassHTML } from './silass';

export type HTMLTemplateRenderer = (data: ResumeShape) => string;

const templates: Record<string, HTMLTemplateRenderer> = {
    starter: renderStarterHTML,
    silass: renderSilassHTML,
    // Add more templates as they are refactored
};

export function getHTMLTemplate(templateName: string, data: ResumeShape): string {
    const renderer = templates[templateName] || renderStarterHTML; // Fallback to starter
    return renderer(data);
}
