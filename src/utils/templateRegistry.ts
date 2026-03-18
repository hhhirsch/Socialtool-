import { DEFAULT_PRESET_ID } from '../constants';
import { DEFAULT_TEMPLATE_ID, GRAPHIC_TEMPLATES } from '../templates';
import type { FieldValues, GraphicTemplate, Preset, TemplateField } from '../types';
import { getPresetById } from './presets';

export function getTemplates(): GraphicTemplate[] {
  return GRAPHIC_TEMPLATES;
}

export function getTemplateById(id: string): GraphicTemplate {
  return GRAPHIC_TEMPLATES.find((template) => template.id === id) ?? GRAPHIC_TEMPLATES[0];
}

export function getTemplateDefaults(template: GraphicTemplate): FieldValues {
  return template.fields.reduce<FieldValues>((accumulator, field) => {
    accumulator[field.id] = template.defaults[field.id] ?? field.defaultValue ?? '';
    return accumulator;
  }, {});
}

export function mergeTemplateFieldValues(
  template: GraphicTemplate,
  persistedValues: FieldValues | null | undefined
): FieldValues {
  const defaults = getTemplateDefaults(template);

  if (!persistedValues) {
    return defaults;
  }

  for (const field of template.fields) {
    const value = persistedValues[field.id];
    if (typeof value === 'string') {
      defaults[field.id] = value;
    }
  }

  return defaults;
}

export function ensureCompatiblePresetId(template: GraphicTemplate, presetId: string): string {
  if (template.supportedPresetIds.includes(presetId)) {
    return presetId;
  }

  return template.supportedPresetIds[0] ?? DEFAULT_PRESET_ID;
}

export function getTemplateField(template: GraphicTemplate, fieldId: string): TemplateField | undefined {
  return template.fields.find((field) => field.id === fieldId);
}

export function getSupportedPresets(template: GraphicTemplate, presets: Preset[]): Preset[] {
  return presets.filter((preset) => template.supportedPresetIds.includes(preset.id));
}

export function isValidTemplateId(templateId: string): boolean {
  return GRAPHIC_TEMPLATES.some((template) => template.id === templateId);
}

export { DEFAULT_TEMPLATE_ID, getPresetById };
