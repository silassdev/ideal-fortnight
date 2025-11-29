// scripts/generateTemplateIndex.js
// Usage: node scripts/generateTemplateIndex.js
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'components', 'templates');
const out = path.join(dir, 'index.ts');

const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.tsx') && f !== 'index.tsx' && f !== 'index.ts');

const imports = [];
const exports = [];
const metaLines = [];

files.forEach((file, i) => {
    const base = path.basename(file, '.tsx'); // e.g. apela
    const varComp = `T${i}`;
    const varMeta = `M${i}`;
    imports.push(`import ${varComp}, { metadata as ${varMeta} } from './${base}';`);
    exports.push(`  { key: ${varMeta}.key, component: ${varComp}, metadata: ${varMeta} },`);
});

const content = `/* THIS FILE IS GENERATED. Run: node scripts/generateTemplateIndex.js */
${imports.join('\n')}

import type { TemplateExport } from '@/types/template';

export const templates: { key: string; component: any; metadata: any }[] = [
${exports.join('\n')}
];

export default templates;
`;

fs.writeFileSync(out, content, 'utf8');
console.log('Wrote', out);
