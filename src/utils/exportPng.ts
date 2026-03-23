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

    if (openedTab.closed) {
      throw new Error('Der geöffnete Export-Tab wurde bereits geschlossen.');
    }

    let graphicRoot: HTMLElement;
    if (liveFrame) {
      const liveDocument = await waitForIframeDocument(liveFrame);
      await waitForPreviewReady(liveDocument);
      graphicRoot = getExportRoot(liveDocument);
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

      const exportDocument = await waitForIframeDocument(iframe, documentHtml);
      await waitForPreviewReady(exportDocument);
      graphicRoot = getExportRoot(exportDocument);
    }

    const canvas = await html2canvas(graphicRoot, {
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

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((result) => {
        if (result) {
          resolve(result);
          return;
        }

        reject(new Error('PNG-Datei konnte nicht erstellt werden.'));
      }, 'image/png');
    });

    const blobUrl = URL.createObjectURL(blob);
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), BLOB_URL_REVOCATION_DELAY_MS);

    if (openedTab.closed) {
      throw new Error('Der geöffnete Export-Tab wurde bereits geschlossen.');
    }

    openedTab.location.replace(blobUrl);
  } catch (error) {
    const normalizedError = error instanceof Error ? error : new Error(String(error));

    if (openedTab && !openedTab.closed) {
      try {
        writeExportTabMessage(openedTab, 'PNG-Export fehlgeschlagen', normalizedError.message);
      } catch {
        openedTab.close();
      }
    }

    throw normalizedError;
  } finally {
    mountNode?.remove();
  }
}
