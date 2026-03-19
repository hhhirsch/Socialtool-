export const EXPORT_ROOT_SELECTOR = '[data-export-root]';

export async function waitForPreviewReady(document: Document): Promise<void> {
  const fontReady =
    'fonts' in document
      ? (document.fonts.ready.catch(() => undefined) as Promise<unknown>)
      : Promise.resolve();
  const images = Array.from(document.images);

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

  const frameWindow = document.defaultView;
  await new Promise<void>((resolve) => {
    if (!frameWindow?.requestAnimationFrame) {
      resolve();
      return;
    }

    frameWindow.requestAnimationFrame(() => frameWindow.requestAnimationFrame(() => resolve()));
  });
}

export function getExportRoot(document: Document): HTMLElement {
  const exportRoot = document.querySelector(EXPORT_ROOT_SELECTOR);
  const elementConstructor = document.defaultView?.HTMLElement;
  const isHtmlElement = elementConstructor
    ? exportRoot instanceof elementConstructor
    : exportRoot?.nodeType === Node.ELEMENT_NODE;

  if (!isHtmlElement) {
    throw new Error('Grafikinhalt für den Export wurde nicht gefunden.');
  }

  return exportRoot as HTMLElement;
}

export async function waitForIframeDocument(
  iframe: HTMLIFrameElement,
  documentHtml?: string
): Promise<Document> {
  if (documentHtml) {
    await new Promise<void>((resolve, reject) => {
      iframe.onload = () => resolve();
      iframe.onerror = () => reject(new Error('Vorschau konnte nicht geladen werden.'));
      iframe.srcdoc = documentHtml;
    });
  } else if (iframe.contentDocument?.readyState !== 'complete') {
    await new Promise<void>((resolve) => {
      iframe.addEventListener('load', () => resolve(), { once: true });
    });
  }

  const previewDocument = iframe.contentDocument;
  if (!previewDocument) {
    throw new Error('Vorschau konnte nicht gelesen werden.');
  }

  return previewDocument;
}

export function withPrintStyles(documentHtml: string, width: number, height: number): string {
  const printStyles = `
    <style>
      @page {
        size: ${width}px ${height}px;
        margin: 0;
      }
      html, body {
        background: white !important;
      }
      body {
        display: block;
      }
      ${EXPORT_ROOT_SELECTOR} {
        width: ${width}px !important;
        height: ${height}px !important;
      }
    </style>
  `;

  return documentHtml.replace('</head>', `${printStyles}</head>`);
}
