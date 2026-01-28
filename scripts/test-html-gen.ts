import { renderStarterHTML } from '../lib/templates/html/starter';
<<<<<<< HEAD
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
=======
import fs from 'fs';
import path from 'path';

const mockData: any = {
    name: 'John Doe',
    title: 'Senior Software Engineer',
    summary: 'Experienced developer with a passion for clean code and scalable architecture.',
    email: 'john@example.com',
    phone: '+1 234 567 890',
    location: 'Remote',
    website: 'https://johndoe.dev',
    experience: [
        {
            id: '1',
            role: 'Lead Developer',
            company: 'Tech Corp',
            startMonth: 'Jan',
            startYear: '2020',
            endMonth: 'Present',
            current: true,
            description: 'Leading a team of 10 developers to build modern web applications.'
>>>>>>> bf91622a3607463691f397f654a191374ddbebd0
        }
    ],
    education: [
        {
<<<<<<< HEAD
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
=======
            id: '1',
            school: 'University of Technology',
            degree: 'B.S. in Computer Science',
            startMonth: 'Sep',
            startYear: '2016',
            endMonth: 'May',
            endYear: '2020'
        }
    ],
    skills: [
        {
            id: '1',
            name: 'Frontend',
            skills: 'React, TypeScript, Next.js, Tailwind CSS'
        },
        {
            id: '2',
            name: 'Backend',
            skills: 'Node.js, PostgreSQL, Redis, Docker'
        }
    ],
    sectionTitles: {
        summary: 'Profile',
        experience: 'Work History',
        education: 'Education',
        skills: 'Technical Skills'
    }
};

const html = renderStarterHTML(mockData);
fs.writeFileSync(path.join(process.cwd(), 'test_starter.html'), html);
console.log('Test HTML generated: test_starter.html');
>>>>>>> bf91622a3607463691f397f654a191374ddbebd0
