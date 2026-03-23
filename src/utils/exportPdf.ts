import {
  serializePreviewDocument,
  waitForIframeDocument,
  waitForPreviewReady,
  withPrintStyles,
} from './previewExport';
import { applyGeneralPostTitleFit } from '../lib/grafik-builder/useFitText';

/**
 * Uses a print-optimized popup so only the current graphic is exported to PDF.
 */
export async function exportPdf(
  documentHtml: string,
  width: number,
  height: number,
  liveFrame?: HTMLIFrameElement | null
): Promise<void> {
  const popup = window.open('', '_blank');

  if (!popup) {
    throw new Error('Bitte erlaube Pop-ups, damit der PDF-Export geöffnet werden kann.');
  }

  let exportDocumentHtml = documentHtml;

  if (liveFrame) {
    const liveDocument = await waitForIframeDocument(liveFrame);
    await waitForPreviewReady(liveDocument);
    applyGeneralPostTitleFit(liveDocument);
    exportDocumentHtml = serializePreviewDocument(liveDocument);
  }

  popup.document.open();
  popup.document.write(withPrintStyles(exportDocumentHtml, width, height));
  popup.document.close();

  await new Promise<void>((resolve) => {
    if (popup.document.readyState === 'complete') {
      resolve();
      return;
    }

    popup.addEventListener('load', () => resolve(), { once: true });
  });

  await waitForPreviewReady(popup.document);

  popup.addEventListener(
    'afterprint',
    () => {
      popup.close();
    },
    { once: true }
  );
  popup.focus();
  popup.print();
}
