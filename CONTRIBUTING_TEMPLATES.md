# CONTRIBUTING_TEMPLATES.md

This document explains how to add a new resume **template** to the project so it appears automatically in the app, includes author credit, and can be used for preview and PDF export.

Keep changes small, self-contained, and follow the checklist below.

---

## Location & filename

* Place template files under: `components/templates/`
* Use a lowercase, hyphenated filename matching the template key, e.g.
  `components/templates/apela.tsx` (key: `apela`)

---

## Required export pattern

Each template file **must** export:

1. A default React component that receives `{ resume, className? }` props.
2. A `metadata` object.

Minimal example:

```tsx
// components/templates/apela.tsx
import React from 'react';
import { TemplateComponentProps } from '@/types/template';

export const metadata = {
  key: 'apela',
  title: 'Apela',
  description: 'Two-column profile with bold header and modern accent',
  author: 'Apela Dev',
  authorUrl: 'https://github.com/apela-dev',
  thumbnail: '/templates/apela.png',
  tags: ['two-column','modern'],
};

export default function Apela({ resume, className = '' }: TemplateComponentProps) {
  return (
    <div className={className} id="resume-preview">
      {/* Render resume using Tailwind or local CSS */}
      <h1>{resume.name}</h1>
    </div>
  );
}
```

### `metadata` fields

* `key` (string) — **required**, unique identifier (must match filename pattern).
* `title` (string) — human readable name.
* `description` (string) — short summary.
* `author` (string) — contributor name (optional but recommended).
* `authorUrl` (string) — link to contributor profile (GitHub, personal site).
* `thumbnail` (string) — optional path under `/public` (e.g. `/templates/apela.png`).
* `tags` (string[]) — optional keywords.

---

## Styling & assets

* Prefer Tailwind classes for layout and style.
* If a template needs custom CSS, keep it local: e.g. `components/templates/apela.module.css` and import it inside the component.
* Place images or thumbnails under `public/templates/`.
* Avoid global CSS overrides or names that conflict across templates.

---

## Accessibility & content

* Use semantic HTML (headings, lists, landmarks).
* Provide `alt` text for any thumbnail or decorative images.
* Keep contrast and font sizes readable — templates are for professionals.

---

## PDF & preview considerations

* The preview and PDF exporter target the DOM element with id `resume-preview`. Ensure your template either:

  * renders a wrapper with `id="resume-preview"`, or
  * the app wraps the template in a container with that id when rendering previews/exports.
* Keep layout width reasonable (e.g., max-width ~800px) to avoid oversized canvas captures.

---

## Registering the template (generator)

* The repo includes a generator script `scripts/generateTemplateIndex.js` that builds `components/templates/index.ts`.
* After adding a new `<key>.tsx` file run:

  ```bash
  npm run generate:templates
  ```
* The project uses the generated registry to populate TemplatePicker and TemplateRenderer.

**CI note:** Add `"prebuild": "npm run generate:templates"` to `package.json` so the index gets generated automatically during build (Vercel).

---

## Contributor checklist (before opening PR)

* [ ] Filename uses lowercase and matches `metadata.key`.
* [ ] `export default` component and `export const metadata` are present.
* [ ] `metadata.key` is unique (no collisions with existing templates).
* [ ] Thumbnail (if present) is placed at `public/templates/<key>.png` and has `alt` text in picker preview.
* [ ] No global CSS collisions; styles are local or Tailwind-only.
* [ ] Component does not import server-only modules (must be renderable in client preview).
* [ ] Template renders correctly inside `#resume-preview`.
* [ ] Run `npm run generate:templates` and verify `components/templates/index.ts` contains your template.
* [ ] Run the app locally (`npm run dev`) and confirm the template appears in TemplatePicker and the preview renders.
* [ ] Add or update `README` or docs if template has special instructions or license.

---

## PR description guidance

In your pull request:

* Include one-line description of the template and its purpose.
* Provide a screenshot or thumbnail preview.
* Link to your GitHub (set `metadata.authorUrl`).
* Note any special fonts or assets and how maintainers should host them (prefer `public/`).

---

## Licensing & credit

* By submitting a template you confirm the code and assets are yours or properly licensed.
* `metadata.author` and `metadata.authorUrl` are shown in the app as credit; contributors should not expect automatic attribution removal.

---

## Troubleshooting

* Template not appearing: run `npm run generate:templates`, commit the generated `components/templates/index.ts` if you want, or ensure CI runs the generator.
* Build errors: ensure the template file is valid TypeScript/JSX and exports both `default` and `metadata`.
* PDF export artifacts: reduce complex external fonts or large images; ensure `id="resume-preview"` is used.

---

## Quick commands

```bash
# generate registry after adding templates
npm run generate:templates

# add to prebuild so generator runs in CI (package.json)
# "prebuild": "npm run generate:templates"
npm run build
npm run dev
```

---

## Example: minimal template to copy

```tsx
// components/templates/minimal.tsx
export const metadata = { key: 'minimal', title: 'Minimal', author: 'You', authorUrl: 'https://github.com/you' };
export default function Minimal({ resume }) {
  return <div id="resume-preview" className="p-4"><h1>{resume.name || 'Full name'}</h1></div>;
}
```

---

