# Contributing Templates

> [!NOTE]
> This guide explains how to create and submit new resume templates to the project. Templates automatically appear in the app with author credit and support preview and PDF export.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Template Structure](#template-structure)
- [Metadata Configuration](#metadata-configuration)
- [Styling Guidelines](#styling-guidelines)
- [Registration Process](#registration-process)
- [Submission Checklist](#submission-checklist)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### 1. Create Your Template File

Place your template in `components/templates/` using a **lowercase, hyphenated filename** that matches your template key:

```
components/templates/your-template.tsx
```

### 2. Required Structure

Every template must export:
- **Default Component**: React component accepting `{ resume, className? }` props
- **Metadata Object**: Configuration for template discovery

### 3. Generate Registry

After creating your template, run:

```bash
npm run generate:templates
```

This updates `components/templates/index.ts` to include your new template.

---

## Template Structure

### Complete Example

```tsx
// components/templates/modern-pro.tsx
import React from 'react';
import { TemplateComponentProps } from '@/types/template';

export const metadata = {
  key: 'modern-pro',
  title: 'Modern Professional',
  description: 'Clean two-column layout with bold typography',
  author: 'Your Name',
  authorUrl: 'https://github.com/yourusername',
  thumbnail: '/templates/modern-pro.png',
  tags: ['modern', 'two-column', 'professional'],
};

export default function ModernPro({ 
  resume, 
  className = '' 
}: TemplateComponentProps) {
  return (
    <div className={className} id="resume-preview">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">{resume.name}</h1>
        <p className="text-gray-600">{resume.title}</p>
      </header>
      
      {/* Template content */}
      <section className="space-y-4">
        {/* Your resume sections */}
      </section>
    </div>
  );
}
```

### Key Requirements

> [!IMPORTANT]
> - Component must include `id="resume-preview"` on the root element
> - File name must match the `metadata.key` value
> - Both `export default` and `export const metadata` are required

---

## Metadata Configuration

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `key` | `string` | **Required.** Unique identifier matching filename (e.g., `modern-pro`) |
| `title` | `string` | Human-readable template name displayed in the app |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `description` | `string` | Short summary shown in template picker |
| `author` | `string` | Your name or organization |
| `authorUrl` | `string` | Link to GitHub profile or website |
| `thumbnail` | `string` | Preview image path (e.g., `/templates/modern-pro.png`) |
| `tags` | `string[]` | Keywords for filtering (e.g., `['modern', 'minimal']`) |

### Metadata Best Practices

- **Unique Keys**: Ensure `key` doesn't conflict with existing templates
- **Descriptive Titles**: Use clear, professional names
- **Author Attribution**: Include your name and URL for proper credit
- **Relevant Tags**: Help users find templates by style or layout type

---

## Styling Guidelines

### Preferred Approach: Tailwind CSS

Use Tailwind utility classes for maximum flexibility:

```tsx
<div className="max-w-4xl mx-auto p-8">
  <h1 className="text-4xl font-bold text-gray-900">{resume.name}</h1>
</div>
```

### Custom CSS (When Needed)

For complex styling, use CSS modules:

```tsx
// modern-pro.module.css
.customHeader {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

// modern-pro.tsx
import styles from './modern-pro.module.css';

<header className={styles.customHeader}>...</header>
```

### Assets

- **Thumbnails**: Place in `public/templates/<key>.png` (recommended size: 800x1000px)
- **Fonts**: Use web-safe fonts or Google Fonts via CDN
- **Icons**: Prefer SVG or icon libraries like Lucide React

> [!WARNING]
> Avoid global CSS that could affect other templates. Keep styles scoped to your component.

---

## Accessibility Best Practices

Ensure your template is accessible to all users:

- ✅ Use semantic HTML (`<header>`, `<section>`, `<article>`)
- ✅ Maintain proper heading hierarchy (`h1` → `h2` → `h3`)
- ✅ Provide `alt` text for images
- ✅ Ensure sufficient color contrast (WCAG AA minimum)
- ✅ Use readable font sizes (minimum 12px for body text)
- ✅ Test with screen readers when possible

---

## PDF & Export Considerations

### Critical Requirements

> [!CAUTION]
> The PDF exporter relies on `id="resume-preview"` to capture your template. Missing this ID will break exports.

```tsx
// ✅ Correct
<div id="resume-preview" className="max-w-4xl">
  {/* content */}
</div>

// ❌ Incorrect
<div className="max-w-4xl">
  {/* content */}
</div>
```

### Layout Guidelines

- **Maximum Width**: Keep templates around 800-900px for optimal PDF rendering
- **Page Breaks**: Consider adding page break hints for multi-page resumes
- **Print Styles**: Test how your template looks when printed/exported

```tsx
// Example with page break consideration
<div className="page-break-after">
  {/* First page content */}
</div>
```

---

## Registration Process

### Automatic Template Discovery

The project uses a generator script to automatically discover and register templates.

### Step-by-Step

1. **Create your template** in `components/templates/your-template.tsx`

2. **Run the generator**:
   ```bash
   npm run generate:templates
   ```

3. **Verify registration**: Check that `components/templates/index.ts` includes your template

4. **Test locally**:
   ```bash
   npm run dev
   ```

5. **Confirm appearance** in the template picker

### CI/CD Integration

> [!TIP]
> Add generator to prebuild step in `package.json`:
> ```json
> {
>   "scripts": {
>     "prebuild": "npm run generate:templates",
>     "build": "next build"
>   }
> }
> ```

This ensures templates are automatically registered during deployment.

---

## Submission Checklist

Before opening a pull request, verify:

### Code Requirements

- [ ] Filename uses lowercase with hyphens (e.g., `modern-pro.tsx`)
- [ ] Filename matches `metadata.key` exactly
- [ ] `export default` component is present
- [ ] `export const metadata` is present
- [ ] `metadata.key` is unique (no conflicts)
- [ ] Root element has `id="resume-preview"`
- [ ] TypeScript types are correct (`TemplateComponentProps`)

### Styling & Assets

- [ ] Styles are local (Tailwind or CSS modules)
- [ ] No global CSS pollution
- [ ] Thumbnail image (if provided) is in `public/templates/`
- [ ] Thumbnail has reasonable dimensions (800x1000px recommended)

### Testing

- [ ] Ran `npm run generate:templates` successfully
- [ ] Template appears in `components/templates/index.ts`
- [ ] Template renders in local dev server (`npm run dev`)
- [ ] Template appears in template picker
- [ ] PDF export works correctly
- [ ] All sections of resume data display properly

### Documentation

- [ ] Metadata includes `author` and `authorUrl`
- [ ] Description accurately describes the template
- [ ] Tags are relevant and helpful

---

## Pull Request Guidelines

### PR Description Template

```markdown
## Template: [Template Name]

### Description
Brief description of the template's design and purpose.

### Preview
![Template Screenshot](./path-to-screenshot.png)

### Author
- Name: Your Name
- GitHub: [@yourusername](https://github.com/yourusername)

### Special Notes
- Any special fonts or dependencies
- Design inspirations or credits
- Known limitations or considerations
```

### What to Include

- **Screenshot**: Include a high-quality preview image
- **Description**: Explain the template's design philosophy
- **Author Link**: Set `metadata.authorUrl` to your GitHub profile
- **Assets**: Document any special fonts, icons, or resources used
- **License**: Confirm you own the code or it's properly licensed

---

## Troubleshooting

### Template Not Appearing

**Problem**: Template doesn't show in the picker

**Solutions**:
1. Run `npm run generate:templates`
2. Check `components/templates/index.ts` includes your template
3. Verify filename matches `metadata.key`
4. Restart dev server (`npm run dev`)

### Build Errors

**Problem**: TypeScript or build errors

**Solutions**:
1. Ensure both `default export` and `metadata export` are present
2. Check TypeScript types match `TemplateComponentProps`
3. Verify no server-only imports (must be client-compatible)
4. Run `npm run build` to see detailed errors

### PDF Export Issues

**Problem**: PDF export is blank or corrupted

**Solutions**:
1. Verify `id="resume-preview"` exists on root element
2. Keep layout width reasonable (≤900px)
3. Avoid complex external fonts
4. Test with different resume data
5. Check browser console for errors

### Styling Conflicts

**Problem**: Template styles affect other templates

**Solutions**:
1. Use CSS modules instead of global CSS
2. Scope all class names uniquely
3. Prefer Tailwind utility classes
4. Avoid `!important` declarations

---

## Quick Reference

### Minimal Template Starter

```tsx
// components/templates/starter.tsx
import { TemplateComponentProps } from '@/types/template';

export const metadata = {
  key: 'starter',
  title: 'Starter Template',
  author: 'Your Name',
  authorUrl: 'https://github.com/yourusername',
};

export default function Starter({ resume, className = '' }: TemplateComponentProps) {
  return (
    <div id="resume-preview" className={`${className} max-w-4xl p-8`}>
      <h1 className="text-3xl font-bold">{resume.name || 'Your Name'}</h1>
      <p className="text-gray-600">{resume.title || 'Your Title'}</p>
    </div>
  );
}
```

### Common Commands

```bash
# Generate template registry
npm run generate:templates

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run start
```

---

## Licensing & Attribution

By submitting a template, you confirm:

- ✅ Code and assets are your original work or properly licensed
- ✅ You grant permission to use under the project's license
- ✅ `metadata.author` and `metadata.authorUrl` will be displayed in the app
- ✅ Attribution cannot be removed without your consent

Templates are credited to their authors in the template picker and throughout the application.

---

## Need Help?

- 📚 Check existing templates in `components/templates/` for examples
- 🐛 Open an issue for bugs or questions
- 💬 Reach out to maintainers for clarification
- 📖 Review the main [CONTRIBUTING.md](./CONTRIBUTING.md) for general guidelines

**Thank you for contributing to our template collection!** 🎉
