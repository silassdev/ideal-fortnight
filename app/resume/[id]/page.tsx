import React from 'react';
import dbConnect from '@/lib/dbConnect';
import Resume from '@/models/Resume';
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import { notFound } from 'next/navigation';
import { ResumeShape } from '@/types/resume';

export default async function PublicResumePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    await dbConnect();

    // Try to find by _id first, then by publicId
    let resume = await Resume.findById(id).lean();
    if (!resume) {
        resume = await Resume.findOne({ publicId: id }).lean();
    }

    if (!resume) {
        notFound();
    }

    // Convert Mongoose document to ResumeShape
    const resumeData: ResumeShape = {
        _id: resume._id?.toString(),
        publicId: resume.publicId,
        template: resume.template,
        name: resume.name,
        title: resume.title,
        summary: resume.summary,
        contact: resume.contact,
        experience: resume.experience,
        education: resume.education,
        skills: resume.skills,
        createdAt: resume.createdAt?.toString(),
        updatedAt: resume.updatedAt?.toString(),
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <TemplateRenderer
                        templateKey={resume.template || 'apela'}
                        resume={resumeData}
                    />
                </div>
            </div>
        </div>
    );
}
