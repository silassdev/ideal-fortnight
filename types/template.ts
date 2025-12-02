import React from 'react';
import { ResumeShape } from './resume';

export * from './resume';

export interface TemplateComponentProps {
  resume: ResumeShape;
  className?: string;
}

export interface TemplateMetadata {
  key: string;
  title: string;
  description: string;
  author?: string;
  authorUrl?: string;
  thumbnail?: string;
  tags?: string[];
}

export interface TemplateExport {
  key: string;
  component: React.ComponentType<TemplateComponentProps>;
  metadata: TemplateMetadata;
}
