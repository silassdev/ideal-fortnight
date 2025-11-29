export const PDF_DEFAULT = {
    pageFormat: 'a4' as const,
    orientation: 'portrait' as const,
    scale: 2,
};

export function pxToPt(px: number) {
    return (px * 72) / 96;
}
