import { ResumeShape } from '../../../types/resume';

export function renderSilassHTML(data: ResumeShape): string {
    const sectionTitles = data.sectionTitles || {
        summary: 'Professional Summary',
        experience: 'Experience',
        education: 'Education',
        skills: 'Skills',
        projects: 'Projects',
        certifications: 'Certifications'
    };

    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        :root {
            --primary: #4f46e5;
            --slate-900: #0f172a;
            --slate-800: #1e293b;
            --slate-600: #475569;
            --slate-500: #64748b;
            --slate-400: #94a3b8;
            --slate-200: #e2e8f0;
            --slate-100: #f1f5f9;
            --slate-50: #f8fafc;
        }

        body {
            font-family: 'Inter', sans-serif;
            color: var(--slate-800);
            line-height: 1.5;
            margin: 0;
            padding: 0;
            background: white;
        }
        
        .container {
            max-width: 210mm;
            margin: 0 auto;
            min-height: 297mm;
            padding: 20mm;
            box-sizing: border-box;
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 40px;
        }

        aside {
            border-right: 1px solid var(--slate-100);
            padding-right: 30px;
        }
        
        .name {
            font-size: 28px;
            font-weight: 800;
            color: var(--slate-900);
            margin: 0 0 4px 0;
            letter-spacing: -0.02em;
        }
        
        .title {
            font-size: 13px;
            font-weight: 700;
            color: var(--primary);
            text-transform: uppercase;
            letter-spacing: 0.15em;
            margin-bottom: 30px;
        }
        
        .contact-info {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 40px;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 12px;
            color: var(--slate-600);
        }

        .contact-item svg {
            width: 14px;
            height: 14px;
            color: var(--slate-400);
        }
        
        .section {
            margin-bottom: 35px;
        }
        
        .section-header {
            font-size: 11px;
            font-weight: 700;
            color: var(--slate-400);
            text-transform: uppercase;
            letter-spacing: 0.15em;
            margin-bottom: 15px;
            border-bottom: 1px solid var(--slate-100);
            padding-bottom: 8px;
        }
        
        .summary {
            font-size: 13.5px;
            color: var(--slate-600);
            white-space: pre-wrap;
            text-align: justify;
        }
        
        .item-row {
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 2px;
        }
        
        .item-title {
            font-weight: 700;
            color: var(--slate-900);
            font-size: 14px;
        }
        
        .item-date {
            font-size: 11px;
            font-weight: 600;
            color: var(--slate-400);
            background: var(--slate-50);
            padding: 2px 8px;
            border-radius: 12px;
        }
        
        .item-subtitle {
            font-size: 13px;
            font-weight: 600;
            color: var(--primary);
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .item-subtitle::before {
            content: "";
            width: 3px;
            height: 10px;
            background: #4f46e54d;
            border-radius: 10px;
        }
        
        .item-description {
            font-size: 13px;
            color: var(--slate-600);
            white-space: pre-wrap;
        }

        .skill-category {
            background: #f8fafc80;
            padding: 10px;
            border-radius: 8px;
            border: 1px solid #f1f5f980;
            margin-bottom: 12px;
        }

        .skill-cat-name {
            font-weight: 700;
            font-size: 10px;
            color: var(--slate-900);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 4px;
        }

        .skill-list {
            font-size: 12px;
            color: var(--slate-600);
            line-height: 1.4;
        }

        .edu-item {
            margin-bottom: 15px;
        }

        .edu-school {
            font-weight: 700;
            font-size: 13px;
            color: var(--slate-900);
        }

        .edu-degree {
            font-size: 12px;
            color: var(--primary);
            font-weight: 500;
        }

        .edu-date {
            font-size: 10px;
            color: var(--slate-400);
            font-weight: 700;
            text-transform: uppercase;
        }

        @page {
            size: A4;
            margin: 0;
        }

        @media print {
            body { background: white; }
            .container { padding: 15mm; width: 210mm; min-height: auto; }
            .item-date { background: transparent; padding: 0; border: none; }
            .section { page-break-inside: avoid; }
        }
    `;

    const experienceHtml = (data.experience || []).map(exp => `
        <div class="item-row">
            <div class="item-header">
                <div class="item-title">${exp.role || ''}</div>
                <div class="item-date">
                    ${exp.startMonth || ''} ${exp.startYear || ''} — 
                    ${exp.current ? 'Present' : `${exp.endMonth || ''} ${exp.endYear || ''}`}
                </div>
            </div>
            <div class="item-subtitle">
                ${exp.company || ''} 
                ${exp.location ? `<span style="color: #94a3b8; font-weight: 400;">• ${exp.location}</span>` : ''}
            </div>
            <div class="item-description">${exp.description || ''}</div>
        </div>
    `).join('');

    const educationHtml = (data.education || []).map(edu => `
        <div class="edu-item">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <div class="edu-school">${edu.school || ''}</div>
                <div class="edu-date">${edu.startYear || ''} — ${edu.endYear || ''}</div>
            </div>
            <div class="edu-degree">${edu.degree || ''}</div>
            ${edu.description ? `<div style="font-size: 11px; color: #94a3b8; font-style: italic;">${edu.description}</div>` : ''}
        </div>
    `).join('');

    const projectsHtml = (data.projects || []).map(p => `
        <div class="item-row">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <div class="item-title">${p.title || ''}</div>
                ${p.link ? `<div style="width: 4px; height: 4px; background: #cbd5e1; border-radius: 50%;"></div><a href="${p.link}" style="font-size: 11px; color: #4f46e5; text-decoration: underline;">${p.link}</a>` : ''}
            </div>
            <div class="item-description">${p.description || ''}</div>
        </div>
    `).join('');

    const skillsHtml = (data.skills || []).map(cat => `
        <div class="skill-category">
            <div class="skill-cat-name">${cat.name || ''}</div>
            <div class="skill-list">${cat.skills || ''}</div>
        </div>
    `).join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name || 'Resume'} - ${data.title || ''}</title>
    <style>${styles}</style>
</head>
<body>
    <div class="container">
        <aside>
            <div style="margin-bottom: 30px;">
                <h1 class="name">${data.name || 'Your Name'}</h1>
                <div class="title">${data.title || 'Professional Title'}</div>
            </div>

            <div class="contact-info">
                ${(data.email || data.contact?.email) ? `
                    <div class="contact-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        <span>${data.email || data.contact?.email}</span>
                    </div>` : ''}
                ${(data.phone || data.contact?.phone) ? `
                    <div class="contact-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        <span>${data.phone || data.contact?.phone}</span>
                    </div>` : ''}
                ${(data.location || data.contact?.location) ? `
                    <div class="contact-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        <span>${data.location || data.contact?.location}</span>
                    </div>` : ''}
                ${(data.website || data.contact?.website) ? `
                    <div class="contact-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                        <span>${data.website || data.contact?.website}</span>
                    </div>` : ''}
                ${(data.linkedin || data.contact?.linkedin) ? `
                    <div class="contact-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                        <span>${data.linkedin || data.contact?.linkedin}</span>
                    </div>` : ''}
                ${(data.github || data.contact?.github) ? `
                    <div class="contact-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                        <span>${data.github || data.contact?.github}</span>
                    </div>` : ''}
            </div>

            <section class="section">
                <div class="section-header">${sectionTitles.skills}</div>
                <div class="skill-grid">${skillsHtml}</div>
            </section>

            <section class="section">
                <div class="section-header">${sectionTitles.education}</div>
                <div class="edu-list">${educationHtml}</div>
            </section>
        </aside>

        <main>
            ${data.summary ? `
            <section class="section">
                <div class="section-header">${sectionTitles.summary}</div>
                <div class="summary">${data.summary}</div>
            </section>
            ` : ''}

            ${experienceHtml ? `
            <section class="section">
                <div class="section-header">${sectionTitles.experience}</div>
                <div>${experienceHtml}</div>
            </section>
            ` : ''}

            ${projectsHtml ? `
            <section class="section">
                <div class="section-header">${sectionTitles.projects}</div>
                <div>${projectsHtml}</div>
            </section>
            ` : ''}
        </main>
    </div>
</body>
</html>
    `.trim();
}
