import { sanitizeHtml } from './sanitizeHtml';

/**
 * Builds a complete HTML document for the preview iframe.
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
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    width: ${width}px;
    height: ${height}px;
    overflow: hidden;
  }
  ${css}
</style>
</head>
<body>${safeHtml}</body>
</html>`;
}
