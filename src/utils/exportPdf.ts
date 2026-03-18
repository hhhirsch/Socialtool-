import { buildPreviewDocument } from './previewDocument';

/**
 * Uses a print-optimized popup so only the current graphic is exported to PDF.
 */
export function exportPdf(html: string, css: string, width: number, height: number): void {
  const popup = window.open('', '_blank', 'noopener,noreferrer');

  if (!popup) {
    throw new Error('Bitte erlaube Pop-ups, damit der PDF-Export geöffnet werden kann.');
  }

  const previewDocument = buildPreviewDocument(html, css, width, height);
  const printDocument = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>LinkedIn Grafik Export</title>
    <style>
      @page {
        size: ${width}px ${height}px;
        margin: 0;
      }
      html, body {
        margin: 0;
        width: ${width}px;
        height: ${height}px;
        overflow: hidden;
        background: white;
      }
      body {
        display: grid;
        place-items: center;
      }
      iframe {
        width: ${width}px;
        height: ${height}px;
        border: 0;
      }
      @media print {
        html, body {
          width: ${width}px;
          height: ${height}px;
        }
      }
    </style>
  </head>
  <body>
    <iframe id="print-frame" sandbox="allow-same-origin"></iframe>
    <script>
      const frame = document.getElementById('print-frame');
      const waitForImages = (doc) => Promise.all(Array.from(doc.images).map((image) => image.complete ? Promise.resolve() : new Promise((resolve) => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', resolve, { once: true });
      })));
      frame.addEventListener('load', async () => {
        const doc = frame.contentDocument;
        if (!doc) {
          return;
        }
        try {
          if (doc.fonts && doc.fonts.ready) {
            await doc.fonts.ready;
          }
          await waitForImages(doc);
        } catch (error) {
          console.warn('PDF assets may be incomplete', error);
        }
        setTimeout(() => window.print(), 120);
      }, { once: true });
      frame.srcdoc = ${JSON.stringify(previewDocument)};
    </script>
  </body>
</html>`;

  popup.document.open();
  popup.document.write(printDocument);
  popup.document.close();
}
