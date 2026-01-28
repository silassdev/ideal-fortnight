import { renderStarterHTML } from '../lib/templates/html/starter';
import { renderSilassHTML } from '../lib/templates/html/silass';
import fs from 'fs';
import path from 'path';

const dummyData = {
    name: 'Alex Rivera',
    title: 'Senior Full Stack Developer',
    email: 'alex.rivera@example.com',
    phone: '+1 (555) 000-1111',
    location: 'San Francisco, CA',
    summary: 'Product-focused engineer with 8+ years of experience building scalable web applications. Expert in React, Node.js, and cloud architecture.',
    experience: [
        {
            id: '1',
            role: 'Senior Software Engineer',
            company: 'TechFlow Systems',
            location: 'Remote',
            startMonth: 'Jan',
            startYear: '2020',
            current: true,
            description: 'Lead developer for the core dashboard, improving performance by 40%.'
        }
    ],
    education: [
        {
            id: 'e1',
            school: 'University of California, Berkeley',
            degree: 'B.S. Computer Science',
            startYear: '2012',
            endYear: '2016'
        }
    ],
    skills: [
        { name: 'Frontend', skills: 'React, Next.js, Tailwind CSS' },
        { name: 'Backend', skills: 'Node.js, PostgreSQL, Redis' }
    ]
};

// Generate Starter
const starterHtml = renderStarterHTML(dummyData as any);
fs.writeFileSync(path.join(__dirname, '../starter-test.html'), starterHtml);
console.log('Starter HTML generated at starter-test.html');

// Generate Silass
const silassHtml = renderSilassHTML(dummyData as any);
fs.writeFileSync(path.join(__dirname, '../silass-test.html'), silassHtml);
console.log('Silass HTML generated at silass-test.html');
