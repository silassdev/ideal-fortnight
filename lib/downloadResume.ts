import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { getHTMLTemplate } from './templates/html';
import { ResumeShape } from '../types/resume';

/**
 * downloadPdfSafe
 * - Slices the element vertically into segments (maxHeight) to avoid canvas memory explosion.
 * - Renders each slice with html2canvas and appends to jsPDF as pages.
 */
/**
 * downloadPdfSafe
 * - Slices the element vertically into segments (maxHeight) to avoid canvas memory explosion.
 * - Renders each slice with html2canvas and appends to jsPDF as pages.
 */
export async function downloadPdfSafe(element: HTMLElement, opts: { filename?: string; maxCanvasHeight?: number } = {}) {
  const filename = opts.filename || 'resume.pdf';
  const maxCanvasHeight = opts.maxCanvasHeight || 2000; // conservative for safety

  // hide toolbars/buttons if any
  const width = element.scrollWidth;
  const height = element.scrollHeight;
  const scale = 2; // high quality

  const pdf = new jsPDF('p', 'pt', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();

  let y = 0;
  let first = true;

  while (y < height) {
    const sliceHeight = Math.min(maxCanvasHeight, height - y);

    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      width,
      height: sliceHeight,
      y: y,
      windowHeight: height
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (!first) pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
    first = false;
    y += sliceHeight;
  }

  pdf.save(filename);
}

/**
 * downloadDoc
 * - Improved .doc generation with Word-friendly headers and robust download trigger.
 */
export async function downloadDoc(resume: ResumeShape, opts: { filename?: string } = {}) {
  const filename = opts.filename || `${resume.name || 'resume'}.doc`;
  const templateName = resume.template || 'starter';
  const htmlContent = getHTMLTemplate(templateName, resume);

  // Wrap in basic Word-friendly container if not already
  const completeHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'></head>
      <body>${htmlContent}</body>
    </html>
  `.trim();

  const blob = new Blob(['\uFEFF', completeHtml], { type: 'application/msword;charset=utf-8' });

  // Use a more direct download method to avoid "download failed" on some systems
  if ((window.navigator as any).msSaveOrOpenBlob) {
    (window.navigator as any).msSaveOrOpenBlob(blob, filename);
  } else {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * downloadHtml
 * - Downloads the resume as a standalone HTML file.
 */
export async function downloadHtml(resume: ResumeShape, opts: { filename?: string } = {}) {
  const filename = opts.filename || `${resume.name || 'resume'}.html`;
  const templateName = resume.template || 'starter';
  const html = getHTMLTemplate(templateName, resume);

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  saveAs(blob, filename);
}

/**
 * downloadPdfFromHtml
 * - Opens the HTML template in a hidden iframe and triggers the print dialog.
 * - This provides much higher quality and better pagination than html2canvas.
 */
export async function downloadPdfFromHtml(resume: ResumeShape) {
  const templateName = resume.template || 'starter';
  const html = getHTMLTemplate(templateName, resume);

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(html);
    doc.close();

    // Wait for fonts/images to load (if any external ones)
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();

      // Cleanup after a delay (print is blocking but safari/others might differ)
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 500);
  }
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
