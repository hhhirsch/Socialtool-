import html2canvas from 'html2canvas';
import { buildPreviewDocument } from './previewDocument';

async function waitForAssets(document: Document): Promise<void> {
  const fontReady = 'fonts' in document ? (document.fonts.ready.catch(() => undefined) as Promise<unknown>) : Promise.resolve();
  const images = Array.from(document.images);

  await Promise.all([
    fontReady,
    ...images.map(
      (image) =>
        image.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              image.addEventListener('load', () => resolve(), { once: true });
              image.addEventListener('error', () => resolve(), { once: true });
            })
    ),
  ]);

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

/**
 * Exports the isolated graphic in its original preset resolution.
 */
export async function exportPng(
  html: string,
  css: string,
  width: number,
  height: number,
  filename: string
): Promise<void> {
  const mountNode = document.createElement('div');
  mountNode.style.position = 'fixed';
  mountNode.style.inset = '0 auto auto -99999px';
  mountNode.style.width = `${width}px`;
  mountNode.style.height = `${height}px`;
  document.body.appendChild(mountNode);

  const iframe = document.createElement('iframe');
  iframe.setAttribute('sandbox', 'allow-same-origin');
  iframe.style.width = `${width}px`;
  iframe.style.height = `${height}px`;
  iframe.style.border = '0';
  mountNode.appendChild(iframe);

  try {
    await new Promise<void>((resolve, reject) => {
      iframe.onload = () => resolve();
      iframe.onerror = () => reject(new Error('Vorschau für PNG-Export konnte nicht geladen werden.'));
      iframe.srcdoc = buildPreviewDocument(html, css, width, height);
    });

    const exportDocument = iframe.contentDocument;
    if (!exportDocument) {
      throw new Error('Exportdokument konnte nicht gelesen werden.');
    }

    await waitForAssets(exportDocument);

    const graphicRoot = exportDocument.getElementById('graphic-root');
    if (!(graphicRoot instanceof HTMLElement)) {
      throw new Error('Grafikinhalt für den Export wurde nicht gefunden.');
    }

    const canvas = await html2canvas(graphicRoot, {
      width,
      height,
      scale: 1,
      backgroundColor: null,
      allowTaint: false,
      useCORS: true,
      logging: false,
      windowWidth: width,
      windowHeight: height,
    });

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((result) => {
        if (result) {
          resolve(result);
          return;
        }

        reject(new Error('PNG-Datei konnte nicht erstellt werden.'));
      }, 'image/png');
    });

    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${filename}.png`;
    link.click();
    URL.revokeObjectURL(downloadUrl);
  } finally {
    mountNode.remove();
  }
}
