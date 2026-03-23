import { getFontEmbedCSS, toPng } from 'html-to-image';
import { buildExportMarkup, EXPORT_ROOT_SELECTOR } from './previewDocument';

const EXPORT_ASSET_TIMEOUT_MS = 1_000;
const EXPORT_RENDER_DELAY_MS = 100;
const EXPORT_CONTAINER_ERROR = 'Export-Container konnte nicht erzeugt werden.';
const PNG_EXPORT_STATUS = {
  preparing: 'PNG wird erstellt…',
  exportContainerCreated: 'Export-Container erstellt',
  waitingForAssets: 'warte auf Fonts und Bilder',
  assetsReady: 'Fonts und Bilder bereit',
  searchingExportRoot: 'suche Export-Root',
  exportRootFound: 'Export-Root gefunden',
  embeddingFonts: 'Schriften werden eingebettet',
  pngCreated: 'PNG erstellt',
  downloadStarted: 'Download gestartet',
  imageOpened: 'Bild öffnen und lange drücken zum Speichern',
  failed: 'Export fehlgeschlagen — bitte erneut versuchen',
} as const;

const EXPORT_PIXEL_RATIO = 2;

export function isIOSWebKit(): boolean {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

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

function writeExportTabStatus(openedTab: ReturnType<typeof window.open> | undefined, message: string): void {
  if (!openedTab || openedTab.closed) {
    return;
  }

  writeExportTabMessage(openedTab, 'PNG-Export', message);
}

function reportExportStatus(
  message: string,
  onStatus?: (message: string) => void,
  openedTab?: ReturnType<typeof window.open>
): void {
  onStatus?.(message);
  writeExportTabStatus(openedTab, message);
}

function getFilenameWithExtension(filename: string): string {
  return filename.endsWith('.png') ? filename : `${filename}.png`;
}

async function getFontEmbedCssBestEffort(exportRoot: HTMLElement): Promise<string> {
  try {
    return await getFontEmbedCSS(exportRoot, {
      includeQueryParams: true,
      preferredFontFormat: 'woff2',
    });
  } catch {
    return '';
  }
}

function openImageInTab(dataUrl: string, filename: string, openedTab?: ReturnType<typeof window.open>): void {
  if (openedTab && !openedTab.closed) {
    openedTab.document.open();
    openedTab.document.write(`<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(filename)}</title>
  </head>
  <body style="margin:0;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#000;color:#fff;font-family:system-ui,sans-serif;">
    <p style="margin:0;padding:16px;font-size:14px;text-align:center;opacity:0.8;">Bild lange drücken → „Bild sichern“</p>
    <img src="${dataUrl}" alt="${escapeHtml(filename)}" style="display:block;max-width:100%;height:auto;" />
  </body>
</html>`);
    openedTab.document.close();
    return;
  }

  const fallbackTab = window.open(dataUrl, '_blank');
  if (!fallbackTab) {
    window.location.href = dataUrl;
  }
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
    throw new Error('Export-Root fehlt: Grafikinhalt für den Export wurde nicht gefunden.');
  }

  return exportRoot;
}

function waitForTimeout(delay: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, delay);
  });
}

function waitForAnimationFrame(): Promise<void> {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}

async function waitForFontsBestEffort(): Promise<void> {
  if (!('fonts' in document)) {
    return;
  }

  try {
    await Promise.race([document.fonts.ready, waitForTimeout(EXPORT_ASSET_TIMEOUT_MS)]);
  } catch {
    // Best effort only.
  }
}

function waitForImageBestEffort(image: HTMLImageElement): Promise<void> {
  if (image.complete) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const timeoutState: { current?: number } = {};
    let settled = false;

    const finalize = (): void => {
      if (settled) {
        return;
      }

      settled = true;

      if (timeoutState.current !== undefined) {
        window.clearTimeout(timeoutState.current);
      }

      image.removeEventListener('load', finalize);
      image.removeEventListener('error', finalize);
      resolve();
    };

    image.addEventListener('load', finalize);
    image.addEventListener('error', finalize);
    timeoutState.current = window.setTimeout(finalize, EXPORT_ASSET_TIMEOUT_MS);
  });
}

async function waitForExportAssetsBestEffort(container: HTMLElement): Promise<void> {
  await waitForAnimationFrame();
  await waitForTimeout(EXPORT_RENDER_DELAY_MS);

  await Promise.all([
    waitForFontsBestEffort(),
    Promise.all(Array.from(container.querySelectorAll('img')).map((image) => waitForImageBestEffort(image))),
  ]);
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
  onStatus?: (message: string) => void,
  openedTab?: ReturnType<typeof window.open>
): Promise<void> {
  let mountNode: HTMLDivElement | null = null;

  try {
    const filenameWithExtension = getFilenameWithExtension(filename);
    const ios = isIOSWebKit();

    reportExportStatus(PNG_EXPORT_STATUS.preparing, onStatus, openedTab);

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

    if (!(document.body instanceof HTMLBodyElement)) {
      throw new Error(EXPORT_CONTAINER_ERROR);
    }

    document.body.appendChild(mountNode);

    reportExportStatus(PNG_EXPORT_STATUS.exportContainerCreated, onStatus, openedTab);

    if (!mountNode.isConnected) {
      throw new Error(EXPORT_CONTAINER_ERROR);
    }

    reportExportStatus(PNG_EXPORT_STATUS.searchingExportRoot, onStatus, openedTab);

    const graphicRoot = getExportRoot(mountNode);

    reportExportStatus(PNG_EXPORT_STATUS.exportRootFound, onStatus, openedTab);
    reportExportStatus(PNG_EXPORT_STATUS.waitingForAssets, onStatus, openedTab);
    await waitForExportAssetsBestEffort(mountNode);
    reportExportStatus(PNG_EXPORT_STATUS.assetsReady, onStatus, openedTab);
    reportExportStatus(PNG_EXPORT_STATUS.embeddingFonts, onStatus, openedTab);

    const fontEmbedCSS = await getFontEmbedCssBestEffort(graphicRoot);

    let dataUrl: string;
    try {
      const exportOptions = {
        width,
        height,
        pixelRatio: EXPORT_PIXEL_RATIO,
        includeQueryParams: true,
        cacheBust: true,
        preferredFontFormat: 'woff2',
        style: {
          width: `${width}px`,
          height: `${height}px`,
          transform: 'scale(1)',
          transformOrigin: 'top left',
        },
        ...(fontEmbedCSS ? { fontEmbedCSS } : {}),
      };

      dataUrl = await toPng(graphicRoot, exportOptions);
    } catch (error) {
      throw new Error(`html-to-image fehlgeschlagen: ${normalizeError(error).message}`);
    }

    reportExportStatus(PNG_EXPORT_STATUS.pngCreated, onStatus, openedTab);

    if (ios) {
      reportExportStatus(PNG_EXPORT_STATUS.imageOpened, onStatus, openedTab);
      openImageInTab(dataUrl, filenameWithExtension, openedTab);
      return;
    }

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filenameWithExtension;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
    reportExportStatus(PNG_EXPORT_STATUS.downloadStarted, onStatus, openedTab);
  } catch (error) {
    const normalizedError = normalizeError(error);
    onStatus?.(PNG_EXPORT_STATUS.failed);

    if (openedTab && !openedTab.closed) {
      writeExportTabError(openedTab, normalizedError);
    }

    throw normalizedError;
  } finally {
    mountNode?.remove();
  }
}
