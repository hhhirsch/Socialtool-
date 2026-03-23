import html2canvas from 'html2canvas';
import { applyGeneralPostTitleFit } from '../lib/grafik-builder/useFitText';
import { buildExportMarkup, EXPORT_ROOT_SELECTOR } from './previewDocument';

const EXPORT_RENDER_SETTLE_DELAY_MS = 75;
const EXPORT_CONTAINER_ERROR = 'Export-Container konnte nicht erzeugt werden.';
const PNG_EXPORT_STATUS = {
  preparing: 'PNG wird erstellt…',
  exportContainerCreated: 'Export-Container erstellt',
  searchingExportRoot: 'suche Export-Root',
  exportRootFound: 'Export-Root gefunden',
  pngCreated: 'PNG erstellt',
  downloadStarted: 'Download gestartet',
  imageOpened: 'PNG wird im aktuellen Tab geöffnet',
  failed: 'Export fehlgeschlagen — bitte erneut versuchen',
} as const;

const EXPORT_PIXEL_RATIO = 2;

export function isIOSWebKit(): boolean {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
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

function getExportRoot(container: ParentNode): HTMLElement {
  const exportRoot = container.querySelector(EXPORT_ROOT_SELECTOR);
  if (!(exportRoot instanceof HTMLElement)) {
    throw new Error('Export-Root fehlt: Grafikinhalt für den Export wurde nicht gefunden.');
  }

  return exportRoot;
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/png');
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
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, EXPORT_RENDER_SETTLE_DELAY_MS);
    });
    let dataUrl: string | null = null;
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
      if (ios) {
        const pngBlob = await canvasToBlob(canvas);
        if (pngBlob) {
          window.location.href = URL.createObjectURL(pngBlob);
        } else {
          dataUrl = canvas.toDataURL('image/png');
          window.location.href = dataUrl;
        }
      } else {
        dataUrl = canvas.toDataURL('image/png');
      }
    } catch (error) {
      throw new Error(`html2canvas fehlgeschlagen: ${normalizeError(error).message}`);
    }

    reportExportStatus(PNG_EXPORT_STATUS.pngCreated, onStatus);

    if (ios) {
      reportExportStatus(PNG_EXPORT_STATUS.imageOpened, onStatus);
      return;
    }

    if (!dataUrl) {
      throw new Error('PNG-Daten konnten für den Desktop-Download nicht erzeugt werden.');
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
