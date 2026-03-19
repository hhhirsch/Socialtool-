import { waitForPreviewReady, withPrintStyles } from './previewExport';

/**
 * Uses a print-optimized popup so only the current graphic is exported to PDF.
 */
export async function exportPdf(documentHtml: string, width: number, height: number): Promise<void> {
  const popup = window.open('', '_blank', 'noopener,noreferrer');

  if (!popup) {
    throw new Error('Bitte erlaube Pop-ups, damit der PDF-Export geöffnet werden kann.');
  }

  popup.document.open();
  popup.document.write(withPrintStyles(documentHtml, width, height));
  popup.document.close();

  await new Promise<void>((resolve) => {
    if (popup.document.readyState === 'complete') {
      resolve();
      return;
    }

    popup.addEventListener('load', () => resolve(), { once: true });
  });

  await waitForPreviewReady(popup.document);

  popup.addEventListener(
    'afterprint',
    () => {
      popup.close();
    },
    { once: true }
  );
  popup.focus();
  popup.print();
}
