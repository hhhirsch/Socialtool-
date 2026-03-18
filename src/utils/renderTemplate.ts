import type { FieldValues, TemplateField } from '../types';

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
  fields: TemplateField[]
): string {
  const fieldMap = new Map(fields.map((field) => [field.id, field]));

  return htmlTemplate.replace(/{{\s*([a-zA-Z0-9_-]+)\s*}}/g, (_, placeholder: string) => {
    const field = fieldMap.get(placeholder);
    const rawValue = fieldValues[placeholder] ?? field?.defaultValue ?? '';
    const safeValue = escapeHtml(rawValue);

    if (field?.multiline || field?.type === 'textarea') {
      return safeValue.replace(/\n/g, '<br />');
    }

    return safeValue;
  });
}
