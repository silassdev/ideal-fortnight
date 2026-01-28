import { ResumeShape } from '../../../types/resume';

export function renderStarterHTML(data: ResumeShape): string {
    const sectionTitles = data.sectionTitles || {
        summary: 'Professional Summary',
        experience: 'Experience',
        education: 'Education',
        skills: 'Skills',
        projects: 'Projects',
        certifications: 'Certifications'
    };

    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        
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
            font-family: 'Outfit', sans-serif;
            color: var(--slate-800);
            line-height: 1.6;
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
            padding-bottom: 30px;
            border-bottom: 2px solid var(--slate-100);
        }
        
        .name {
            font-size: 36px;
            font-weight: 700;
            color: var(--slate-900);
            margin: 0 0 8px 0;
            letter-spacing: -0.02em;
        }
        
        .title {
            font-size: 16px;
            font-weight: 500;
            color: var(--primary);
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
            color: var(--slate-500);
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .contact-item svg {
            width: 14px;
            height: 14px;
            color: var(--slate-400);
        }
        
        .section {
            margin-bottom: 32px;
        }
        
        .section-header {
            font-size: 14px;
            font-weight: 700;
            color: var(--slate-900);
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .section-header::after {
            content: "";
            height: 1px;
            flex: 1;
            background: var(--slate-100);
        }
        
        .summary {
            font-size: 14px;
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
            margin-bottom: 4px;
        }
        
        .item-title {
            font-weight: 600;
            color: var(--slate-900);
            font-size: 15px;
        }
        
        .item-date {
            font-size: 12px;
            font-weight: 500;
            color: var(--slate-400);
            background: var(--slate-50);
            padding: 2px 8px;
            border-radius: 12px;
        }
        
        .item-subtitle {
            font-size: 14px;
            font-weight: 500;
            color: var(--primary);
            margin-bottom: 8px;
        }
        
        .item-description {
            font-size: 13.5px;
            color: var(--slate-600);
            white-space: pre-wrap;
        }
        
        .skill-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
        }
        
        .skill-category {
            background: var(--slate-50);
            padding: 12px;
            border-radius: 8px;
            flex: 1 1 200px;
            border: 1px solid var(--slate-100);
        }
        
        .skill-cat-name {
            font-weight: 700;
            font-size: 12px;
            color: var(--slate-900);
            text-transform: uppercase;
            margin-bottom: 6px;
        }
        
        .skill-list {
            font-size: 13px;
            color: var(--slate-600);
        }

        @page {
            size: A4;
            margin: 0;
        }

        @media print {
            body {
                background: white;
            }
            .container {
                box-shadow: none;
                padding: 15mm;
                width: 210mm;
                min-height: auto;
            }
            .item-date {
                background: transparent;
                padding: 0;
                border: none;
            }
            .section {
                page-break-inside: avoid;
            }
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
            <div class="item-subtitle">${exp.company || ''}</div>
            <div class="item-description">${exp.description || ''}</div>
        </div>
    `).join('');

    const educationHtml = (data.education || []).map(edu => `
        <div class="item-row">
            <div class="item-header">
                <div class="item-title">${edu.school || ''}</div>
                <div class="item-date">
                    ${edu.startMonth || ''} ${edu.startYear || ''} — 
                    ${edu.current ? 'Present' : `${edu.endMonth || ''} ${edu.endYear || ''}`}
                </div>
            </div>
            <div class="item-subtitle">${edu.degree || ''}</div>
            <div class="item-description">${edu.description || ''}</div>
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
        <header class="header">
            <h1 class="name">${data.name || 'Your Name'}</h1>
            <div class="title">${data.title || 'Professional Title'}</div>
            <div class="contact-info">
                ${(data.email || data.contact?.email) ? `
                    <div class="contact-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        <span style="color: #64748b;">${data.email || data.contact?.email}</span>
                    </div>` : ''}
                ${(data.phone || data.contact?.phone) ? `
                    <div class="contact-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        <span style="color: #64748b;">${data.phone || data.contact?.phone}</span>
                    </div>` : ''}
                ${(data.location || data.contact?.location) ? `
                    <div class="contact-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        <span style="color: #64748b;">${data.location || data.contact?.location}</span>
                    </div>` : ''}
                ${(data.website || data.contact?.website) ? `
                    <div class="contact-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                        <span style="color: #64748b;">${data.website || data.contact?.website}</span>
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
            <div class="skill-grid">${skillsHtml}</div>
        </section>
        ` : ''}
    </div>
</body>
</html>
    `.trim();
}
