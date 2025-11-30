import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

/**
 * downloadPdfSafe
 * - Slices the element vertically into segments (maxHeight) to avoid canvas memory explosion.
 * - Renders each slice with html2canvas and appends to jsPDF as pages.
 */
export async function downloadPdfSafe(element: HTMLElement, opts: { filename?: string; maxCanvasHeight?: number } = {}) {
    const filename = opts.filename || 'resume.pdf';
    const maxCanvasHeight = opts.maxCanvasHeight || 2400; // px - tune if memory issues

    // get full height & width
    const width = element.scrollWidth;
    const height = element.scrollHeight;

    // scale for html2canvas high DPI
    const scale = Math.min(2, (window.devicePixelRatio || 1));

    // PDF page size in px (A4 ~ 595x842 pt, but we can fit to width)
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // compute ratio to fit element width into PDF width
    // render each slice as canvas and convert to image scaled down to page width
    const ratio = pageWidth / (width * (1 / scale));

    // slice loop
    let y = 0;
    let first = true;
    while (y < height) {
        const sliceHeight = Math.min(maxCanvasHeight, height - y);

        // create wrapper clone and set clip
        const cloned = element.cloneNode(true) as HTMLElement;
        cloned.style.width = `${width}px`;
        cloned.style.position = 'fixed';
        cloned.style.left = '-9999px';
        cloned.style.top = '0px';
        // create a viewport container to scroll clone to y
        const container = document.createElement('div');
        container.style.width = `${width}px`;
        container.style.height = `${sliceHeight}px`;
        container.style.overflow = 'hidden';
        container.appendChild(cloned);
        document.body.appendChild(container);
        cloned.style.transform = `translateY(-${y}px)`;
        // render slice
        const canvas = await html2canvas(cloned, { scale, useCORS: true, allowTaint: true, width, height: sliceHeight });
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const imgProps = (canvas as any);
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (!first) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
        first = false;

        // cleanup
        document.body.removeChild(container);
        y += sliceHeight;
    }

    // save
    pdf.save(filename);
}

/**
 * downloadDoc
 * - Simple .doc generation by wrapping HTML. Good for basic Word download compatibility.
 */
export async function downloadDoc(resume: any, opts: { filename?: string } = {}) {
    const filename = opts.filename || 'resume.doc';
    // create a simple HTML representation (you can customize)
    const html = `
    <html><head><meta charset="utf-8"><title>Resume</title></head>
    <body>
      <h1>${escapeHtml(resume.name || '')}</h1>
      <h3>${escapeHtml(resume.title || '')}</h3>
      <p>${escapeHtml(resume.summary || '')}</p>
      ${(resume.experience || []).map((e: any) => `
        <h4>${escapeHtml(e.role || '')} — ${escapeHtml(e.company || '')}</h4>
        <ul>${(e.bullets || []).map((b: string) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>
      `).join('')}
    </body></html>
  `;
    const blob = new Blob(['\uFEFF', html], { type: 'application/msword;charset=utf-8' });
    saveAs(blob, filename);
}

function escapeHtml(str = '') {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
