
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.join(__dirname, '..', 'components', 'templates');
const out = path.join(dir, 'index.ts');

const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.tsx') && f !== 'index.tsx' && f !== 'index.ts' && f !== 'TemplateRenderer.tsx');

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

const content = `/* THIS FILE IS GENERATED. DO NOT DELETE OR MODIFY. Run: node scripts/generateTemplateIndex.js */
${imports.join('\n')}

import type { TemplateExport } from '@/types/template';

export const templates: { key: string; component: any; metadata: any }[] = [
${exports.join('\n')}
];

export default templates;
`;

fs.writeFileSync(out, content, 'utf8');
console.log('Wrote', out);
