const BLOCKED_TAGS = ['script', 'iframe', 'object', 'embed', 'link', 'meta', 'base'];
const URL_ATTRIBUTES = ['href', 'src', 'action', 'formaction', 'xlink:href'];

/**
 * Keeps the preview pipeline static by removing executable or navigation-related HTML.
 */
export function sanitizeHtml(html: string): string {
  const parser = new DOMParser();
  const documentFragment = parser.parseFromString(html, 'text/html');

  BLOCKED_TAGS.forEach((tag) => {
    documentFragment.querySelectorAll(tag).forEach((element) => element.remove());
  });

  documentFragment.querySelectorAll('*').forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      const attributeName = attribute.name.toLowerCase();
      const attributeValue = attribute.value.trim().toLowerCase();

      if (attributeName.startsWith('on')) {
        element.removeAttribute(attribute.name);
        return;
      }

      if (URL_ATTRIBUTES.includes(attributeName)) {
        if (
          attributeValue.startsWith('javascript:') ||
          attributeValue.startsWith('vbscript:') ||
          attributeValue.startsWith('data:text/html')
        ) {
          element.removeAttribute(attribute.name);
        }
      }
    });
  });

  return documentFragment.body.innerHTML;
}
