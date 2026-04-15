import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

const FONT_SIZE_STEP = 4;

const GENERAL_POST_TITLE_DEFAULT = {
  maxFontSize: 88,
  minFontSize: 32,
  maxHeight: 350,
};

const GENERAL_POST_TITLE_WIDE = {
  maxFontSize: 54,
  minFontSize: 24,
  maxHeight: 210,
};

const GENERAL_POST_TITLE_WIDE_HALF = {
  maxFontSize: 27,
  minFontSize: 12,
  maxHeight: 105,
};

export function fitTextElement(
  element: HTMLElement,
  maxFontSize: number,
  minFontSize: number,
  step = FONT_SIZE_STEP
): number {
  let nextFontSize = maxFontSize;
  element.style.fontSize = `${nextFontSize}px`;
  const availableHeight = element.clientHeight;

  if (availableHeight <= 0) {
    return nextFontSize;
  }

  while (
    element.scrollHeight > availableHeight &&
    nextFontSize > minFontSize
  ) {
    nextFontSize = Math.max(nextFontSize - step, minFontSize);
    element.style.fontSize = `${nextFontSize}px`;
  }

  return nextFontSize;
}

function isHtmlElement(node: Element | null, ownerDocument: Document | null): node is HTMLElement {
  if (!node) {
    return false;
  }

  const elementConstructor = ownerDocument?.defaultView?.HTMLElement;
  return elementConstructor ? node instanceof elementConstructor : false;
}

export function applyGeneralPostTitleFit(root: ParentNode): number | null {
  const ownerDocument = root instanceof Document ? root : root.ownerDocument;
  const title = root.querySelector('.s5-title');

  if (!isHtmlElement(title, ownerDocument)) {
    return null;
  }

  const slide = root.querySelector('.slide');
  const config = isHtmlElement(slide, ownerDocument)
    ? slide.classList.contains('preset-600x322')
      ? GENERAL_POST_TITLE_WIDE_HALF
      : slide.classList.contains('preset-1200x644')
        ? GENERAL_POST_TITLE_WIDE
        : GENERAL_POST_TITLE_DEFAULT
    : GENERAL_POST_TITLE_DEFAULT;

  title.style.maxHeight = `${config.maxHeight}px`;
  title.style.overflow = 'hidden';

  return fitTextElement(title, config.maxFontSize, config.minFontSize);
}

/**
 * Reduces the font size step by step until the text fits inside
 * its container without overflowing.
 *
 * @param maxFontSize Start size in px (for example 88)
 * @param minFontSize Lower bound in px (for example 32)
 * @param deps Dependencies that should trigger a reset/re-check (for example [text])
 */
export function useFitText(
  maxFontSize: number,
  minFontSize: number,
  deps: unknown[]
): [RefObject<HTMLDivElement | null>, number] {
  const ref = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  useEffect(() => {
    setFontSize(maxFontSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    if (element.scrollHeight <= element.clientHeight) {
      return;
    }

    if (fontSize > minFontSize) {
      setFontSize((previous) => Math.max(previous - FONT_SIZE_STEP, minFontSize));
    }
  }, [fontSize, minFontSize]);

  return [ref, fontSize];
}
