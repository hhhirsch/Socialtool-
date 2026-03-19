import type { FieldValues, TemplateFieldDefinition } from '../types';
import { formatGermanDate } from './dateFormatting';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Replaces template placeholders with escaped plain-text values.
 * Textareas keep line breaks by converting them to <br> tags.
 */
export function renderTemplate(
  htmlTemplate: string,
  fieldValues: FieldValues,
  fields: TemplateFieldDefinition[],
  rawHtmlPlaceholders: string[] = []
): string {
  const fieldMap = new Map(
    fields
      .filter((field) => field.type !== 'group')
      .map((field) => [field.id, field])
  );
  const rawHtmlPlaceholderSet = new Set(rawHtmlPlaceholders);

  return htmlTemplate.replace(/{{\s*([a-zA-Z0-9_-]+)\s*}}/g, (_, placeholder: string) => {
    const field = fieldMap.get(placeholder);
    const rawValue = fieldValues[placeholder] ?? field?.defaultValue ?? '';

    if (rawHtmlPlaceholderSet.has(placeholder)) {
      return rawValue;
    }

    const displayValue = field?.type === 'date' ? formatGermanDate(rawValue) : rawValue;
    const safeValue = escapeHtml(displayValue);

    if (field?.multiline || field?.type === 'textarea') {
      return safeValue.replace(/\n/g, '<br />');
    }

    return safeValue;
  });
}
