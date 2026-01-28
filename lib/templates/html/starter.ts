import { ResumeShape } from '../../../types/resume';

export function renderStarterHTML(data: ResumeShape): string {
    const sectionTitles = data.sectionTitles || {
        summary: 'Professional Summary',
        experience: 'Experience',
        education: 'Education',
        skills: 'Skills',
        projects: 'Projects'
    };

    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        
        body {
            font-family: 'Outfit', sans-serif;
            color: #1e293b;
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
        }
        
        .header {
            text-align: center;
            margin-bottom: 35px;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 30px;
        }
        
        .name {
            font-size: 36px;
            font-weight: 700;
            color: #0f172a;
            margin: 0 0 5px 0;
            letter-spacing: -0.02em;
        }
        
        .title {
            font-size: 16px;
            font-weight: 500;
            color: #4f46e5;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            margin-bottom: 20px;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
            font-size: 13px;
            color: #64748b;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .contact-item svg {
            color: #94a3b8;
        }
        
        .section {
            margin-bottom: 30px;
        }
        
        .section-header {
            font-size: 13px;
            font-weight: 700;
            color: #4f46e5;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .section-header::after {
            content: "";
            flex: 1;
            height: 1px;
            background: #f1f5f9;
        }
        
        .summary {
            font-size: 14px;
            color: #475569;
            white-space: pre-wrap;
        }
        
        .item-row {
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 4px;
        }
        
        .item-title {
            font-weight: 700;
            color: #0f172a;
            font-size: 15px;
        }
        
        .item-date {
            font-size: 12px;
            font-weight: 500;
            color: #94a3b8;
        }
        
        .item-subtitle {
            font-size: 13px;
            font-weight: 600;
            color: #4f46e5;
            margin-bottom: 8px;
        }
        
        .item-description {
            font-size: 13px;
            color: #475569;
            white-space: pre-wrap;
        }
        
        @page {
            size: A4;
            margin: 0;
        }

        @media print {
            body { background: white; }
            .container { padding: 15mm; width: 210mm; min-height: auto; }
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
            <div class="item-subtitle">${exp.company || ''} ${exp.location ? `• ${exp.location}` : ''}</div>
            <div class="item-description">${exp.description || ''}</div>
        </div>
    `).join('');

    const educationHtml = (data.education || []).map(edu => `
        <div class="item-row">
            <div class="item-header">
                <div class="item-title">${edu.school || ''}</div>
                <div class="item-date">${edu.startYear || ''} — ${edu.endYear || ''}</div>
            </div>
            <div class="item-subtitle">${edu.degree || ''}</div>
            ${edu.description ? `<div class="item-description" style="font-style: italic;">${edu.description}</div>` : ''}
        </div>
    `).join('');

    const projectsHtml = (data.projects || []).map(p => `
        <div class="item-row">
            <div class="item-header">
                <div class="item-title">${p.title || ''}</div>
                ${p.link ? `<a href="${p.link}" style="font-size: 12px; color: #4f46e5;">${p.link}</a>` : ''}
            </div>
            <div class="item-description">${p.description || ''}</div>
        </div>
    `).join('');

    const skillsHtml = (data.skills || []).map(cat => `
        <div style="margin-bottom: 10px;">
            <span style="font-weight: 700; font-size: 12px; color: #0f172a; text-transform: uppercase;">${cat.name || ''}:</span>
            <span style="font-size: 13px; color: #475569;">${cat.skills || ''}</span>
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
        <header class="header">
            <h1 class="name">${data.name || 'Your Name'}</h1>
            <div class="title">${data.title || 'Professional Title'}</div>
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
            </div>
        </header>

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

        ${educationHtml ? `
        <section class="section">
            <div class="section-header">${sectionTitles.education}</div>
            <div>${educationHtml}</div>
        </section>
        ` : ''}

        ${skillsHtml ? `
        <section class="section">
            <div class="section-header">${sectionTitles.skills}</div>
            <div>${skillsHtml}</div>
        </section>
        ` : ''}

        ${projectsHtml ? `
        <section class="section">
            <div class="section-header">${sectionTitles.projects}</div>
            <div>${projectsHtml}</div>
        </section>
        ` : ''}
    </div>
</body>
</html>
    `.trim();
}
