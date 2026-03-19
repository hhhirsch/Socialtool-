import html2canvas from 'html2canvas';
import { getExportRoot, waitForIframeDocument, waitForPreviewReady } from './previewExport';

/**
 * Exports the isolated graphic in its original preset resolution.
 */
export async function exportPng(
  documentHtml: string,
  width: number,
  height: number,
  filename: string,
  liveFrame?: HTMLIFrameElement | null
): Promise<void> {
  let mountNode: HTMLDivElement | null = null;

  try {
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

    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${filename}.png`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  } finally {
    mountNode?.remove();
  }
}
