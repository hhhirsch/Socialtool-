/**
 * Removes <script> tags and inline event handlers from HTML
 * to ensure safe static rendering in the preview iframe.
 * Uses the browser's DOM parser for robust sanitization.
 */
export function sanitizeHtml(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Remove all script elements
  const scripts = doc.querySelectorAll('script');
  scripts.forEach((el) => el.remove());

  // Remove event handler attributes from all elements
  const allElements = doc.querySelectorAll('*');
  allElements.forEach((el) => {
    const attrs = Array.from(el.attributes);
    for (const attr of attrs) {
      // Remove on* event handlers (onclick, onload, onerror, etc.)
      if (attr.name.toLowerCase().startsWith('on')) {
        el.removeAttribute(attr.name);
      }
      // Neutralize dangerous URL schemes (javascript:, data:, vbscript:)
      if (
        ['href', 'src', 'action', 'formaction', 'data'].includes(attr.name.toLowerCase())
      ) {
        const val = attr.value.trim().toLowerCase();
        if (
          val.startsWith('javascript:') ||
          val.startsWith('data:') ||
          val.startsWith('vbscript:')
        ) {
          el.setAttribute(attr.name, '#');
        }
      }
    }
  });

  return doc.body.innerHTML;
}
