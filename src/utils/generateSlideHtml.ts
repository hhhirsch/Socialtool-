import { buildPreviewDocument } from './previewDocument';
import { renderTemplate } from './renderTemplate';
import type { FieldValues, GraphicTemplate } from '../types';

/**
 * Generates a complete, standalone HTML document string for the given template and field values.
 * The returned string includes the full `<html>` structure, Google Fonts import, and inline CSS
 * so it can be rendered as a self-contained graphic at the specified dimensions.
 */
export function generateSlideHtml(
  template: GraphicTemplate,
  fieldValues: FieldValues,
  width: number,
  height: number
): string {
  const resolvedValues = template.resolveFieldValues?.(fieldValues) ?? fieldValues;
  const renderedHtml = renderTemplate(template.htmlTemplate, resolvedValues, template.fields);
  return buildPreviewDocument(renderedHtml, template.css, width, height);
}

/**
 * Copies a complete standalone HTML document for the given slide to the system clipboard.
 */
export async function copySlideHtml(
  template: GraphicTemplate,
  fieldValues: FieldValues,
  width: number,
  height: number
): Promise<void> {
  const html = generateSlideHtml(template, fieldValues, width, height);
  await navigator.clipboard.writeText(html);
}
