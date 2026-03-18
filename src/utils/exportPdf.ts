import { buildPreviewDocument } from './previewDocument';

/**
 * Opens a new window with only the preview content and triggers print.
 * The user can then save as PDF via the browser's print dialog.
 */
export function exportPdf(
  html: string,
  css: string,
  width: number,
  height: number
): void {
  const doc = buildPreviewDocument(html, css, width, height);

  const printContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>LinkedIn Grafik – PDF Export</title>
<style>
  @page {
    size: ${width}px ${height}px;
    margin: 0;
  }
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    width: ${width}px;
    height: ${height}px;
    overflow: hidden;
  }
  @media print {
    html, body {
      width: ${width}px;
      height: ${height}px;
    }
  }
</style>
</head>
<body>
<iframe id="content" src="about:blank" style="width:${width}px;height:${height}px;border:none;overflow:hidden;" frameborder="0"></iframe>
<script>
  var iframe = document.getElementById('content');
  var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(${JSON.stringify(doc)});
  iframeDoc.close();
  iframe.onload = function() {
    setTimeout(function() { window.print(); }, 300);
  };
  // Fallback: trigger print after a delay
  setTimeout(function() { window.print(); }, 1000);
</script>
</body>
</html>`;

  const blob = new Blob([printContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}
