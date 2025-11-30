import dynamic from 'next/dynamic';
import React from 'react';

const TemplateEditor = dynamic(() => import('@/components/dashboard/TemplateEditor'));

export default async function TemplatePage({ params }: { params: Promise<{ key: string }> }) {
    const { key } = await params;
    return <TemplateEditor templateKey={key} />;
}
