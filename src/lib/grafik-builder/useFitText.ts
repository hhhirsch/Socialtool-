import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

const FONT_SIZE_STEP = 4;

const GENERAL_POST_TITLE_DEFAULT = {
  maxFontSize: 88,
  minFontSize: 32,
  maxHeight: 350,
};

const GENERAL_POST_TITLE_1200 = {
  maxFontSize: 54,
  minFontSize: 24,
  maxHeight: 210,
};

export function fitTextElement(
  element: HTMLElement,
  maxFontSize: number,
  minFontSize: number,
  step = FONT_SIZE_STEP
): number {
  let nextFontSize = maxFontSize;
  element.style.fontSize = `${nextFontSize}px`;

  while (
    element.clientHeight > 0 &&
    element.scrollHeight > element.clientHeight &&
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
  return elementConstructor ? node instanceof elementConstructor : true;
}

export function applyGeneralPostTitleFit(root: ParentNode): number | null {
  const ownerDocument = root instanceof Document ? root : root.ownerDocument;
  const title = root.querySelector('.s5-title');

  if (!isHtmlElement(title, ownerDocument)) {
    return null;
  }

  const slide = root.querySelector('.slide');
  const uses1200Preset = isHtmlElement(slide, ownerDocument)
    ? slide.classList.contains('preset-1200x627')
    : false;
  const config = uses1200Preset ? GENERAL_POST_TITLE_1200 : GENERAL_POST_TITLE_DEFAULT;

  title.style.maxHeight = `${config.maxHeight}px`;
  title.style.overflow = 'hidden';

  return fitTextElement(title, config.maxFontSize, config.minFontSize);
}

/**
 * Reduziert die Schriftgröße schrittweise bis der Text
 * in den Container passt (kein overflow).
 *
 * @param maxFontSize  Startgröße in px (z.B. 88)
 * @param minFontSize  Untergrenze in px (z.B. 32)
 * @param deps         Abhängigkeiten die einen Re-Check auslösen (z.B. [text])
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
  }, [fontSize, minFontSize, maxFontSize]);

  return [ref, fontSize];
}
