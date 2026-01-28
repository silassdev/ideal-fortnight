const { renderStarterHTML } = require('./lib/templates/html/starter');
const fs = require('fs');
const path = require('path');

// Mock data
const mockData = {
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

// Since starter.ts is likely using ES modules (export function ...), 
// and I'm using require (CommonJS) in this node test script, 
// I might need to adjust or use a different test approach if node version is old.
// But starter.ts was written with `export function`.

// I'll just use ts-node again but I'll use a simpler script.
"use strict";
