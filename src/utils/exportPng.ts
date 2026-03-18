import html2canvas from 'html2canvas';
import { buildPreviewDocument } from './previewDocument';

/**
 * Renders HTML+CSS at exact target dimensions into a PNG blob.
 * Creates a hidden iframe at full resolution, renders with html2canvas,
 * then cleans up.
 */
export async function exportPng(
  html: string,
  css: string,
  width: number,
  height: number,
  filename: string
): Promise<void> {
  // Create a hidden container at exact target dimensions
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-99999px';
  container.style.top = '0';
  container.style.width = `${width}px`;
  container.style.height = `${height}px`;
  container.style.overflow = 'hidden';
  document.body.appendChild(container);

  const iframe = document.createElement('iframe');
  iframe.style.width = `${width}px`;
  iframe.style.height = `${height}px`;
  iframe.style.border = 'none';
  iframe.style.overflow = 'hidden';
  container.appendChild(iframe);

  const doc = buildPreviewDocument(html, css, width, height);

  return new Promise<void>((resolve, reject) => {
    iframe.onload = async () => {
      try {
        // Wait for content to render
        await new Promise((r) => setTimeout(r, 500));

        const body = iframe.contentDocument?.body;
        if (!body) {
          throw new Error('Could not access iframe content for export');
        }

        const canvas = await html2canvas(body, {
          width,
          height,
          scale: 1,
          useCORS: true,
          allowTaint: true,
          logging: false,
        });

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('PNG export failed: could not create image'));
            return;
          }
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${filename}.png`;
          a.click();
          URL.revokeObjectURL(url);
          resolve();
        }, 'image/png');
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(container);
      }
    };

    const iframeDoc = iframe.contentDocument;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(doc);
      iframeDoc.close();
    } else {
      document.body.removeChild(container);
      reject(new Error('Could not write to iframe for PNG export'));
    }
  });
}
