import { buildPreviewDocument } from './previewDocument';
import type { FieldValues, GraphicTemplate } from '../types';
import { resolveTemplateSlides } from './resolveTemplateSlides';

/**
 * Generates a complete, standalone HTML document string for the given template and field values.
 * The returned string includes the full `<html>` structure, Google Fonts import, and inline CSS
 * so it can be rendered as a self-contained graphic at the specified dimensions.
 */
export function generateSlideHtml(
  template: GraphicTemplate,
  fieldValues: FieldValues,
  width: number,
  height: number,
  slideIndex = 0
): string {
  const slides = resolveTemplateSlides(template, fieldValues);
  const activeSlide = slides[Math.min(Math.max(slideIndex, 0), slides.length - 1)] ?? slides[0];

  return buildPreviewDocument(activeSlide.html, activeSlide.css, width, height);
}

/**
 * Copies a complete standalone HTML document for the given slide to the system clipboard.
 */
export async function copySlideHtml(
  template: GraphicTemplate,
  fieldValues: FieldValues,
  width: number,
  height: number,
  slideIndex = 0
): Promise<void> {
  const html = generateSlideHtml(template, fieldValues, width, height, slideIndex);
  await navigator.clipboard.writeText(html);
}
