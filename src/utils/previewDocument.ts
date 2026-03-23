import { sanitizeHtml } from './sanitizeHtml';

export const EXPORT_ROOT_ID = 'graphic-root';
export const EXPORT_ROOT_SELECTOR = `#${EXPORT_ROOT_ID}[data-export-root="true"]`;

function buildGraphicStyles(css: string, width: number, height: number): string {
  return `
      :root {
        color-scheme: light;
      }
      *, *::before, *::after {
        box-sizing: border-box;
      }
      html, body {
        margin: 0;
        width: ${width}px;
        height: ${height}px;
        overflow: hidden;
        background: transparent;
      }
      body {
        display: block;
      }
      #${EXPORT_ROOT_ID} {
        width: ${width}px;
        height: ${height}px;
        overflow: hidden;
        isolation: isolate;
      }
      img {
        max-width: 100%;
        display: block;
      }
      ${css}
    `;
}

function scopeGraphicSelector(selector: string, scope: string): string {
  const trimmedSelector = selector.trim();

  if (!trimmedSelector) {
    return trimmedSelector;
  }

  if (
    trimmedSelector === ':root' ||
    trimmedSelector === 'html' ||
    trimmedSelector === 'body' ||
    trimmedSelector === `#${EXPORT_ROOT_ID}`
  ) {
    return scope;
  }

  if (trimmedSelector === '*') {
    return `${scope}, ${scope} *`;
  }

  if (trimmedSelector === '*::before' || trimmedSelector === '*::after') {
    return `${scope} ${trimmedSelector}`;
  }

  return `${scope} ${trimmedSelector}`;
}

function scopeGraphicStyles(css: string, scope: string): string {
  return css.replace(/(^|}|;)\s*([^@{}][^{}]*)\{/g, (_match, boundary: string, selectors: string) => {
    const scopedSelectors = selectors
      .split(',')
      .map((selector) => scopeGraphicSelector(selector, scope))
      .join(', ');

    return `${boundary}\n      ${scopedSelectors} {`;
  });
}

export function buildExportMarkup(
  html: string,
  css: string,
  width: number,
  height: number
): { markup: string; styles: string } {
  const safeHtml = sanitizeHtml(html);
  const graphicStyles = buildGraphicStyles(css, width, height);

  return {
    markup: `<div id="${EXPORT_ROOT_ID}" data-export-root="true">${safeHtml}</div>`,
    styles: scopeGraphicStyles(graphicStyles, EXPORT_ROOT_SELECTOR),
  };
}

/**
 * Generates an isolated iframe document so template CSS can never leak into the app shell.
 */
export function buildPreviewDocument(
  html: string,
  css: string,
  width: number,
  height: number
): string {
  const safeHtml = sanitizeHtml(html);
  const graphicStyles = buildGraphicStyles(css, width, height);

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      ${graphicStyles}
    </style>
  </head>
  <body>
    <div id="${EXPORT_ROOT_ID}" data-export-root="true">${safeHtml}</div>
  </body>
</html>`;
}
