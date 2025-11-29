'use client';

import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

type Props = {
    targetId?: string;             // id of the element to capture (default: 'resume-preview')
    fileName?: string;             // output filename (default: 'resume.pdf')
    scale?: number;                // html2canvas scale for higher quality (default: 2)
    pageFormat?: 'a4' | 'letter';  // PDF page format (default: a4)
    orientation?: 'portrait' | 'landscape'; // PDF orientation (default: portrait)
    onStart?: () => void;
    onComplete?: (success: boolean) => void;
};

export default function DownloadPDFButton({
    targetId = 'resume-preview',
    fileName = 'resume.pdf',
    scale = 2,
    pageFormat = 'a4',
    orientation = 'portrait',
    onStart,
    onComplete,
}: Props) {
    const [isGenerating, setIsGenerating] = useState(false);

    async function handleDownload() {
        try {
            onStart?.();
            setIsGenerating(true);

            const element = document.getElementById(targetId);
            if (!element) throw new Error(`Element with id "${targetId}" not found.`);

            // Ensure web fonts are loaded for accurate rendering
            if ((document as any).fonts && (document as any).fonts.ready) {
                await (document as any).fonts.ready;
            }

            // Render element to canvas
            const canvas = await html2canvas(element, {
                scale,
                useCORS: true,
                allowTaint: false,
                logging: false,
                windowWidth: document.documentElement.scrollWidth,
                windowHeight: document.documentElement.scrollHeight,
                scrollY: -window.scrollY,
            });

            // Create jsPDF instance
            const pdf = new jsPDF(orientation, 'pt', pageFormat);
            const pdfPageWidth = pdf.internal.pageSize.getWidth();  // in pt
            const pdfPageHeight = pdf.internal.pageSize.getHeight(); // in pt

            // Canvas size in pixels
            const canvasWidthPx = canvas.width;
            const canvasHeightPx = canvas.height;

            // We'll fit the canvas horizontally to PDF width (imgWidthPt = pdfPageWidth)
            const imgWidthPt = pdfPageWidth;
            // The full image height in PDF points if scaled to fit width
            const imgHeightPt = (canvasHeightPx * imgWidthPt) / canvasWidthPx;

            // Calculate how many canvas pixels correspond to one PDF page height
            // pixelsPerPagePx = pdfPageHeight * (canvasWidthPx / imgWidthPt)
            // Derivation: pdfPageHeight (pt) maps to (pdfPageHeight * canvasWidthPx / imgWidthPt) pixels
            const pixelsPerPagePx = Math.floor((pdfPageHeight * canvasWidthPx) / imgWidthPt);

            // Safety checks
            if (pixelsPerPagePx <= 0) throw new Error('Invalid page slice calculation (pixelsPerPagePx <= 0).');

            // If the entire image fits on one page, add directly
            if (canvasHeightPx <= pixelsPerPagePx) {
                const imgData = canvas.toDataURL('image/png');
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidthPt, imgHeightPt);
                pdf.save(fileName);
                onComplete?.(true);
                return;
            }

            // Otherwise slice the canvas vertically into page-sized pieces
            let y = 0;
            let pageIndex = 0;

            while (y < canvasHeightPx) {
                const sliceHeightPx = Math.min(pixelsPerPagePx, canvasHeightPx - y);

                // Create a temporary canvas for the slice
                const tmpCanvas = document.createElement('canvas');
                tmpCanvas.width = canvasWidthPx;
                tmpCanvas.height = sliceHeightPx;
                const tmpCtx = tmpCanvas.getContext('2d');
                if (!tmpCtx) throw new Error('Could not create canvas context for slicing.');

                // Draw the slice from the main canvas into tmpCanvas
                // drawImage(source, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
                tmpCtx.drawImage(canvas, 0, y, canvasWidthPx, sliceHeightPx, 0, 0, canvasWidthPx, sliceHeightPx);

                // Convert slice to image data
                const sliceDataUrl = tmpCanvas.toDataURL('image/png');

                // Convert slice height (pixels) to PDF points (pt) using same scale as full image
                const sliceHeightPt = (sliceHeightPx * imgWidthPt) / canvasWidthPx;

                // Add page and image
                if (pageIndex > 0) pdf.addPage();
                pdf.addImage(sliceDataUrl, 'PNG', 0, 0, imgWidthPt, sliceHeightPt);

                // Advance
                y += sliceHeightPx;
                pageIndex += 1;

                // Free memory references (help GC)
                tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
            }

            // Save PDF
            pdf.save(fileName);
            onComplete?.(true);
        } catch (err) {
            console.error('PDF generation failed:', err);
            onComplete?.(false);
            alert((err as Error)?.message || 'Failed to generate PDF. Check console for details.');
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <button
            onClick={handleDownload}
            disabled={isGenerating}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md ${isGenerating ? 'bg-slate-300 text-slate-700' : 'bg-sky-600 text-white hover:bg-sky-700'
                }`}
            aria-disabled={isGenerating}
            title="Download PDF"
        >
            {isGenerating ? (
                <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25"></circle>
                        <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"></path>
                    </svg>
                    Generating…
                </>
            ) : (
                <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 7l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <rect x="3" y="15" width="18" height="6" rx="2" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    Export PDF
                </>
            )}
        </button>
    );
}
