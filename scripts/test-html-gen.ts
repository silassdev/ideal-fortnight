import { renderStarterHTML } from '../lib/templates/html/starter';
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
        }
    ],
    education: [
        {
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
