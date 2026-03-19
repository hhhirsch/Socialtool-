import { sanitizeHtml } from './sanitizeHtml';

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

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
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
      #graphic-root {
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
    </style>
  </head>
  <body>
    <div id="graphic-root" data-export-root="true">${safeHtml}</div>
  </body>
</html>`;
}
