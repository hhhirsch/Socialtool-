import type { FieldValues, GraphicTemplate, TemplateSlideRenderDefinition } from '../types';
import { renderTemplate } from './renderTemplate';

export interface ResolvedTemplateSlide extends TemplateSlideRenderDefinition {
  css: string;
  label: string;
  filename: string;
}

function renderGraphicTemplate(template: GraphicTemplate, fieldValues: FieldValues): string {
  const resolvedFieldValues = template.resolveFieldValues?.(fieldValues) ?? fieldValues;

  return renderTemplate(
    template.htmlTemplate,
    resolvedFieldValues,
    template.fields,
    template.rawHtmlPlaceholders
  );
}

function normalizeSlides(
  template: GraphicTemplate,
  slides: TemplateSlideRenderDefinition[]
): ResolvedTemplateSlide[] {
  const filenamePadding = Math.max(2, String(slides.length).length);

  return slides.map((slide, index) => ({
    ...slide,
    css: slide.css ?? template.css,
    label: slide.label ?? `${index + 1} / ${slides.length}`,
    filename: slide.filename ?? `slide-${String(index + 1).padStart(filenamePadding, '0')}`,
  }));
}

export function resolveTemplateSlides(
  template: GraphicTemplate,
  fieldValues: FieldValues
): ResolvedTemplateSlide[] {
  if (template.resolveSlides) {
    const resolvedSlides = template.resolveSlides(fieldValues, {
      render: (slideFieldValues) => renderGraphicTemplate(template, slideFieldValues),
    });

    if (resolvedSlides.length > 0) {
      return normalizeSlides(template, resolvedSlides);
    }
  }

  return normalizeSlides(template, [
    {
      id: 'slide-1',
      html: renderGraphicTemplate(template, fieldValues),
      label: '1 / 1',
      filename: 'slide-01',
    },
  ]);
}
