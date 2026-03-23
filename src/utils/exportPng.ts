import html2canvas from 'html2canvas';
import { buildExportMarkup, EXPORT_ROOT_SELECTOR } from './previewDocument';

const BLOB_URL_REVOCATION_DELAY_MS = 10_000;
const PREVIEW_READY_TIMEOUT_MS = 15_000;
const PREVIEW_READY_TIMEOUT_ERROR = 'Export-Inhalt konnte nicht rechtzeitig vorbereitet werden.';
const PNG_EXPORT_STATUS = {
  preparing: 'PNG wird vorbereitet...',
  exportContainerCreated: 'Export-Container erstellt',
  waitingForAssets: 'warte auf Fonts und Bilder',
  assetsReady: 'Fonts und Bilder bereit',
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

function getExportRoot(container: ParentNode): HTMLElement {
  const exportRoot = container.querySelector(EXPORT_ROOT_SELECTOR);
  if (!(exportRoot instanceof HTMLElement)) {
    throw new Error('Grafikinhalt für den Export wurde nicht gefunden.');
  }

  return exportRoot;
}

async function waitForExportAssets(container: HTMLElement): Promise<void> {
  const FONT_READY_TIMEOUT_MS = 5_000;
  const fontReady =
    'fonts' in document
      ? (Promise.race([
          document.fonts.ready,
          new Promise((resolve) => window.setTimeout(resolve, FONT_READY_TIMEOUT_MS)),
        ]).catch(() => undefined) as Promise<unknown>)
      : Promise.resolve();
  const images = Array.from(container.querySelectorAll('img'));

  await Promise.all([
    fontReady,
    ...images.map((image) =>
      image.complete
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            image.addEventListener('load', () => resolve(), { once: true });
            image.addEventListener('error', () => resolve(), { once: true });
          })
    ),
  ]);

  await new Promise<void>((resolve) => {
    window.setTimeout(() => {
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve()));
    }, 50);
  });
}

async function waitForExportReadyWithTimeout(container: HTMLElement): Promise<void> {
  let timeoutId: number | undefined;

  try {
    await Promise.race([
      waitForExportAssets(container),
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

    throw new Error(`Export-Inhalt konnte nicht vorbereitet werden: ${normalizedError.message}`);
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
  html: string,
  css: string,
  width: number,
  height: number,
  filename: string,
  openedTab: ReturnType<typeof window.open>
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

    const { markup, styles } = buildExportMarkup(html, css, width, height);

    mountNode = document.createElement('div');
    mountNode.setAttribute('aria-hidden', 'true');
    mountNode.style.position = 'fixed';
    mountNode.style.left = '-99999px';
    mountNode.style.top = '0';
    mountNode.style.width = `${width}px`;
    mountNode.style.height = `${height}px`;
    mountNode.style.overflow = 'hidden';
    mountNode.style.pointerEvents = 'none';
    mountNode.innerHTML = `<style>${styles}</style>${markup}`;
    document.body.appendChild(mountNode);

    writeExportTabStatus(openedTab, PNG_EXPORT_STATUS.exportContainerCreated);
    writeExportTabStatus(openedTab, PNG_EXPORT_STATUS.waitingForAssets);
    await waitForExportReadyWithTimeout(mountNode);
    writeExportTabStatus(openedTab, PNG_EXPORT_STATUS.assetsReady);
    writeExportTabStatus(openedTab, PNG_EXPORT_STATUS.searchingExportRoot);

    const graphicRoot = getExportRoot(mountNode);

    writeExportTabStatus(openedTab, PNG_EXPORT_STATUS.exportRootFound);

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
