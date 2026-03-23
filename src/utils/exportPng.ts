import html2canvas from 'html2canvas';
import { getExportRoot, waitForIframeDocument, waitForPreviewReady } from './previewExport';

const BLOB_URL_REVOCATION_DELAY_MS = 10_000;
const PREVIEW_READY_TIMEOUT_MS = 15_000;
const PREVIEW_READY_TIMEOUT_ERROR = 'Preview-Bereitschaft konnte nicht rechtzeitig bestätigt werden.';
const PNG_EXPORT_STATUS = {
  preparing: 'PNG wird vorbereitet...',
  iframeFound: 'iframe gefunden',
  checkingIframeContentDocument: 'prüfe iframe.contentDocument',
  iframeContentDocumentAvailable: 'iframe.contentDocument vorhanden',
  checkingIframeContentWindow: 'prüfe iframe.contentWindow',
  iframeContentWindowAvailable: 'iframe.contentWindow vorhanden',
  waitingForPreviewReady: 'warte auf Preview-Bereitschaft',
  previewReadyConfirmed: 'Preview-Bereitschaft bestätigt',
  searchingExportRoot: 'suche Export-Root',
  exportRootFound: 'Export-Root gefunden',
  html2canvasStarted: 'html2canvas gestartet',
  canvasCreated: 'Canvas erzeugt',
  blobCreated: 'Blob erzeugt',
  navigatingToPng: 'Navigiere zum PNG',
} as const;

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
  message = 'Der geöffnete PNG-Export-Tab ist nicht verfügbar oder wurde geschlossen.'
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

function writeExportTabStatus(
  openedTab: ReturnType<typeof window.open>,
  message: string
): void {
  ensureOpenedTab(openedTab);
  writeExportTabMessage(openedTab, 'PNG-Export', message);
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

async function waitForPreviewReadyWithTimeout(document: Document): Promise<void> {
  let timeoutId: number | undefined;

  try {
    await Promise.race([
      waitForPreviewReady(document),
      new Promise<never>((_, reject) => {
        timeoutId = window.setTimeout(() => {
          reject(new Error(PREVIEW_READY_TIMEOUT_ERROR));
        }, PREVIEW_READY_TIMEOUT_MS);
      }),
    ]);
  } catch (error) {
    const normalizedError = normalizeError(error);
    if (normalizedError.message === PREVIEW_READY_TIMEOUT_ERROR) {
      throw normalizedError;
    }

    throw new Error(`Preview-Bereitschaft konnte nicht bestätigt werden: ${normalizedError.message}`);
  } finally {
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
    }
  }
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
    writeExportTabStatus(openedTab, PNG_EXPORT_STATUS.preparing);

    let graphicRoot: HTMLElement;
    if (liveFrame) {
      if (!document.body.contains(liveFrame)) {
        throw new Error('iframe nicht gefunden.');
      }

      writeExportTabStatus(openedTab, PNG_EXPORT_STATUS.iframeFound);
      writeExportTabStatus(openedTab, PNG_EXPORT_STATUS.checkingIframeContentDocument);

      try {
        await waitForIframeDocument(liveFrame);
      } catch {
        throw new Error('iframe.contentDocument ist nicht verfügbar.');
      }

      const liveDocument = liveFrame.contentDocument;
      if (!liveDocument) {
        throw new Error('iframe.contentDocument ist nicht verfügbar.');
      }

      writeExportTabStatus(openedTab, PNG_EXPORT_STATUS.iframeContentDocumentAvailable);
      writeExportTabStatus(openedTab, PNG_EXPORT_STATUS.checkingIframeContentWindow);

      if (!liveFrame.contentWindow) {
        throw new Error('iframe.contentWindow ist nicht verfügbar.');
      }

      writeExportTabStatus(openedTab, PNG_EXPORT_STATUS.iframeContentWindowAvailable);
      writeExportTabStatus(openedTab, PNG_EXPORT_STATUS.waitingForPreviewReady);
      await waitForPreviewReadyWithTimeout(liveDocument);
      writeExportTabStatus(openedTab, PNG_EXPORT_STATUS.previewReadyConfirmed);
      writeExportTabStatus(openedTab, PNG_EXPORT_STATUS.searchingExportRoot);

      try {
        graphicRoot = getExportRoot(liveDocument);
      } catch {
        throw new Error('Export-Root im iframe wurde nicht gefunden.');
      }

      writeExportTabStatus(openedTab, PNG_EXPORT_STATUS.exportRootFound);
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
      writeExportTabStatus(openedTab, PNG_EXPORT_STATUS.iframeFound);
      writeExportTabStatus(openedTab, PNG_EXPORT_STATUS.checkingIframeContentDocument);

      try {
        await waitForIframeDocument(iframe, documentHtml);
      } catch {
        throw new Error('iframe.contentDocument ist nicht verfügbar.');
      }

      const exportDocument = iframe.contentDocument;
      if (!exportDocument) {
        throw new Error('iframe.contentDocument ist nicht verfügbar.');
      }

      writeExportTabStatus(openedTab, PNG_EXPORT_STATUS.iframeContentDocumentAvailable);
      writeExportTabStatus(openedTab, PNG_EXPORT_STATUS.checkingIframeContentWindow);

      if (!iframe.contentWindow) {
        throw new Error('iframe.contentWindow ist nicht verfügbar.');
      }

      writeExportTabStatus(openedTab, PNG_EXPORT_STATUS.iframeContentWindowAvailable);
      writeExportTabStatus(openedTab, PNG_EXPORT_STATUS.waitingForPreviewReady);
      await waitForPreviewReadyWithTimeout(exportDocument);
      writeExportTabStatus(openedTab, PNG_EXPORT_STATUS.previewReadyConfirmed);
      writeExportTabStatus(openedTab, PNG_EXPORT_STATUS.searchingExportRoot);

      try {
        graphicRoot = getExportRoot(exportDocument);
      } catch {
        throw new Error('Export-Root im iframe wurde nicht gefunden.');
      }

      writeExportTabStatus(openedTab, PNG_EXPORT_STATUS.exportRootFound);
    }

    let canvas: HTMLCanvasElement;
    writeExportTabStatus(openedTab, PNG_EXPORT_STATUS.html2canvasStarted);
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

    writeExportTabStatus(openedTab, PNG_EXPORT_STATUS.canvasCreated);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((result) => {
        if (result) {
          resolve(result);
          return;
        }

        reject(new Error('canvas.toBlob() hat kein PNG erzeugt.'));
      }, 'image/png');
    });

    writeExportTabStatus(openedTab, PNG_EXPORT_STATUS.blobCreated);

    const blobUrl = URL.createObjectURL(blob);
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), BLOB_URL_REVOCATION_DELAY_MS);

    ensureOpenedTab(openedTab);
    writeExportTabStatus(openedTab, PNG_EXPORT_STATUS.navigatingToPng);
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
