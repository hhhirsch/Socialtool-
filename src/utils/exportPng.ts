import html2canvas from 'html2canvas';
import { getExportRoot, waitForIframeDocument, waitForPreviewReady } from './previewExport';

const BLOB_URL_REVOCATION_DELAY_MS = 10_000;

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function normalizeError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

function ensureOpenedTab(
  openedTab: ReturnType<typeof window.open>,
  message = 'Der geöffnete Export-Tab wurde bereits geschlossen.'
): asserts openedTab is Window {
  if (!openedTab) {
    throw new Error(message);
  }

  if (openedTab.closed) {
    throw new Error(message);
  }
}

export function writeExportTabMessage(
  openedTab: ReturnType<typeof window.open>,
  title: string,
  message: string
): void {
  if (!openedTab || openedTab.closed) {
    return;
  }

  openedTab.document.open();
  openedTab.document.write(`<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:24px;font-family:system-ui,sans-serif;background:#ffffff;color:#111827;">
    <p style="margin:0;font-size:16px;">${escapeHtml(message)}</p>
  </body>
</html>`);
  openedTab.document.close();
}

function writeExportTabError(openedTab: Window, error: Error): void {
  openedTab.document.title = 'PNG-Export fehlgeschlagen';
  openedTab.document.body.innerHTML = `
    <div style="padding:24px;font-family:system-ui,sans-serif;background:#ffffff;color:#111827;">
      <h1 style="margin:0 0 16px;font-size:24px;">PNG-Export fehlgeschlagen</h1>
      <p style="margin:0 0 16px;font-size:16px;">${escapeHtml(error.message)}</p>
      ${
        error.stack
          ? `<pre style="margin:0;padding:16px;overflow:auto;border:1px solid #d1d5db;border-radius:8px;background:#f3f4f6;font-size:13px;line-height:1.5;white-space:pre-wrap;">${escapeHtml(error.stack)}</pre>`
          : ''
      }
    </div>
  `;
}

/**
 * Exports the isolated graphic in its original preset resolution.
 */
export async function exportPng(
  documentHtml: string,
  width: number,
  height: number,
  filename: string,
  openedTab: ReturnType<typeof window.open>,
  liveFrame?: HTMLIFrameElement | null
): Promise<void> {
  let mountNode: HTMLDivElement | null = null;

  try {
    if (!openedTab) {
      throw new Error(
        `PNG "${filename}.png" konnte nicht in neuem Tab geöffnet werden. Bitte Pop-up-Blocker prüfen.`
      );
    }

    ensureOpenedTab(openedTab);

    let graphicRoot: HTMLElement;
    if (liveFrame) {
      if (!document.body.contains(liveFrame)) {
        throw new Error('iframe nicht gefunden.');
      }

      let liveDocument: Document;
      try {
        liveDocument = await waitForIframeDocument(liveFrame);
      } catch (error) {
        throw new Error(`iframe document nicht verfügbar: ${normalizeError(error).message}`);
      }

      await waitForPreviewReady(liveDocument);

      try {
        graphicRoot = getExportRoot(liveDocument);
      } catch (error) {
        throw new Error(`export root nicht gefunden: ${normalizeError(error).message}`);
      }
    } else {
      mountNode = document.createElement('div');
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

      let exportDocument: Document;
      try {
        exportDocument = await waitForIframeDocument(iframe, documentHtml);
      } catch (error) {
        throw new Error(`iframe document nicht verfügbar: ${normalizeError(error).message}`);
      }

      await waitForPreviewReady(exportDocument);

      try {
        graphicRoot = getExportRoot(exportDocument);
      } catch (error) {
        throw new Error(`export root nicht gefunden: ${normalizeError(error).message}`);
      }
    }

    let canvas: HTMLCanvasElement;
    try {
      canvas = await html2canvas(graphicRoot, {
        width,
        height,
        scale: 1,
        backgroundColor: null,
        allowTaint: false,
        foreignObjectRendering: true,
        useCORS: true,
        logging: false,
        windowWidth: width,
        windowHeight: height,
      });
    } catch (error) {
      throw new Error(`html2canvas fehlgeschlagen: ${normalizeError(error).message}`);
    }

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((result) => {
        if (result) {
          resolve(result);
          return;
        }

        reject(new Error('canvas.toBlob() hat kein PNG erzeugt.'));
      }, 'image/png');
    });

    const blobUrl = URL.createObjectURL(blob);
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), BLOB_URL_REVOCATION_DELAY_MS);

    ensureOpenedTab(openedTab);

    console.log('PNG blob erzeugt, navigiere zum Blob');
    openedTab.location.replace(blobUrl);
  } catch (error) {
    const normalizedError = normalizeError(error);

    if (openedTab && !openedTab.closed) {
      writeExportTabError(openedTab, normalizedError);
    }

    throw normalizedError;
  } finally {
    mountNode?.remove();
  }
}
