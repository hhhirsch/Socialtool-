import html2canvas from 'html2canvas';
import { applyGeneralPostTitleFit } from '../lib/grafik-builder/useFitText';
import { buildExportMarkup, EXPORT_ROOT_SELECTOR } from './previewDocument';

const EXPORT_RENDER_DELAY_MS = 75;
const EXPORT_CONTAINER_ERROR = 'Export-Container konnte nicht erzeugt werden.';
const PNG_EXPORT_STATUS = {
  preparing: 'PNG wird erstellt…',
  exportContainerCreated: 'Export-Container erstellt',
  searchingExportRoot: 'suche Export-Root',
  exportRootFound: 'Export-Root gefunden',
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

function reportExportStatus(message: string, onStatus?: (message: string) => void): void {
  onStatus?.(message);
}

function getFilenameWithExtension(filename: string): string {
  return filename.endsWith('.png') ? filename : `${filename}.png`;
}

function openImageInTab(dataUrl: string, filename: string): void {
  const openedTab = window.open('', '_blank');

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

  window.location.href = dataUrl;
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

async function waitForExportAssetsBestEffort(): Promise<void> {
  await waitForAnimationFrame();
  await waitForTimeout(EXPORT_RENDER_DELAY_MS);
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
  onStatus?: (message: string) => void
): Promise<void> {
  let mountNode: HTMLDivElement | null = null;
  const ios = isIOSWebKit();

  try {
    const filenameWithExtension = getFilenameWithExtension(filename);

    reportExportStatus(PNG_EXPORT_STATUS.preparing, onStatus);

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

    reportExportStatus(PNG_EXPORT_STATUS.exportContainerCreated, onStatus);

    if (!mountNode.isConnected) {
      throw new Error(EXPORT_CONTAINER_ERROR);
    }

    reportExportStatus(PNG_EXPORT_STATUS.searchingExportRoot, onStatus);

    const graphicRoot = getExportRoot(mountNode);

    reportExportStatus(PNG_EXPORT_STATUS.exportRootFound, onStatus);
    applyGeneralPostTitleFit(graphicRoot);
    await waitForExportAssetsBestEffort();
    let dataUrl: string;
    try {
      const canvas = await html2canvas(graphicRoot, {
        width,
        height,
        scale: EXPORT_PIXEL_RATIO,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });
      dataUrl = canvas.toDataURL('image/png');
    } catch (error) {
      throw new Error(`html2canvas fehlgeschlagen: ${normalizeError(error).message}`);
    }

    reportExportStatus(PNG_EXPORT_STATUS.pngCreated, onStatus);

    if (ios) {
      reportExportStatus(PNG_EXPORT_STATUS.imageOpened, onStatus);
      openImageInTab(dataUrl, filenameWithExtension);
      return;
    }

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filenameWithExtension;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
    reportExportStatus(PNG_EXPORT_STATUS.downloadStarted, onStatus);
  } catch (error) {
    const normalizedError = normalizeError(error);
    onStatus?.(PNG_EXPORT_STATUS.failed);
    throw normalizedError;
  } finally {
    mountNode?.remove();
  }
}
