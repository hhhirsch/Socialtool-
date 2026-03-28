const BLOCKED_TAGS = ['script', 'iframe', 'object', 'embed', 'link', 'meta', 'base'];
const URL_ATTRIBUTES = ['href', 'src', 'action', 'formaction', 'xlink:href'];
const SAFE_IMAGE_DATA_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
  'image/bmp',
  'image/avif',
]);

function isAllowedImageDataUrl(element: Element, attributeName: string, attributeValue: string): boolean {
  const trimmedValue = attributeValue.trim();
  const commaIndex = trimmedValue.indexOf(',');

  if (commaIndex <= 0) {
    return false;
  }

  const metadata = trimmedValue.slice(0, commaIndex);
  const base64Payload = trimmedValue.slice(commaIndex + 1);
  const metadataMatch = metadata.match(/^data:([^;]+);base64$/i);
  const mimeType = metadataMatch?.[1]?.toLowerCase();

  return (
    element.tagName.toLowerCase() === 'img' &&
    attributeName === 'src' &&
    Boolean(mimeType && SAFE_IMAGE_DATA_MIME_TYPES.has(mimeType)) &&
    /^[A-Za-z0-9+/]+={0,2}$/.test(base64Payload)
  );
}

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
        if (isAllowedImageDataUrl(element, attributeName, attribute.value.trim())) {
          return;
        }

        if (
          attributeValue.startsWith('javascript:') ||
          attributeValue.startsWith('vbscript:') ||
          attributeValue.startsWith('data:')
        ) {
          element.removeAttribute(attribute.name);
        }
      }
    });
  });

  return documentFragment.body.innerHTML;
}
