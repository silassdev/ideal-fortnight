import dynamic from 'next/dynamic';
import React from 'react';

const TemplateEditor = dynamic(() => import('@/components/dashboard/TemplateEditor'), { ssr: false });

export default function TemplatePage({ params }: { params: { key: string } }) {
    const templateKey = params.key;
    return <TemplateEditor templateKey={templateKey} />;
}
