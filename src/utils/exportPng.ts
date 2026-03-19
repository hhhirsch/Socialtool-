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
  const mountNode = document.createElement('div');
  mountNode.style.position = 'fixed';
  mountNode.style.inset = '0 auto auto -99999px';
  mountNode.style.width = `${width}px`;
  mountNode.style.height = `${height}px`;

  const iframe = liveFrame ?? document.createElement('iframe');

  if (!liveFrame) {
    iframe.setAttribute('sandbox', 'allow-same-origin');
    iframe.style.width = `${width}px`;
    iframe.style.height = `${height}px`;
    iframe.style.border = '0';
    document.body.appendChild(mountNode);
    mountNode.appendChild(iframe);
  }

  try {
    const exportDocument = await waitForIframeDocument(iframe, liveFrame ? undefined : documentHtml);

    await waitForPreviewReady(exportDocument);

    const graphicRoot = getExportRoot(exportDocument);
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
    if (!liveFrame) {
      mountNode.remove();
    }
  }
}
