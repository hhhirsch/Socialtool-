const BLOCKED_TAGS = ['script', 'iframe', 'object', 'embed', 'link', 'meta', 'base'];
const URL_ATTRIBUTES = ['href', 'src', 'action', 'formaction', 'xlink:href'];
const SAFE_IMAGE_DATA_URL_PATTERN =
  /^data:image\/(?!svg\+xml)([a-z0-9.+-]+);base64,[a-z0-9+/]+=*$/i;

function isAllowedImageDataUrl(element: Element, attributeName: string, attributeValue: string): boolean {
  return (
    element.tagName.toLowerCase() === 'img' &&
    attributeName === 'src' &&
    SAFE_IMAGE_DATA_URL_PATTERN.test(attributeValue)
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
