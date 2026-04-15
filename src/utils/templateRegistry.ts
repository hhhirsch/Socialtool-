import { DEFAULT_PRESET_ID } from '../constants';
import { DEFAULT_TEMPLATE_ID, GRAPHIC_TEMPLATES } from '../templates';
import type {
  FieldValues,
  GraphicTemplate,
  Preset,
  TemplateCategory,
  TemplateField,
  TemplateFieldDefinition,
  TemplateFieldGroup,
} from '../types';
import { getPresetById } from './presets';

const LEGACY_PRESET_ID_MIGRATIONS: Record<string, string> = {
  '1200x627': '1200x644',
};

function getFieldOptions(field: TemplateField, values: FieldValues) {
  if (field.dependsOn && field.optionGroups) {
    return field.optionGroups[values[field.dependsOn]] ?? field.options ?? [];
  }

  return field.options ?? [];
}

export function isTemplateFieldGroup(field: TemplateFieldDefinition): field is TemplateFieldGroup {
  return field.type === 'group';
}

export function getGroupFieldKey(groupId: string, index: number, fieldId: string): string {
  return `${groupId}.${index}.${fieldId}`;
}

function getGroupFieldOptions(
  group: TemplateFieldGroup,
  field: TemplateField,
  values: FieldValues,
  index: number
) {
  if (field.dependsOn && field.optionGroups) {
    return field.optionGroups[values[getGroupFieldKey(group.id, index, field.dependsOn)]] ?? field.options ?? [];
  }

  return field.options ?? [];
}

export function getGroupFieldIndices(group: TemplateFieldGroup, values: FieldValues): number[] {
  const indexPattern = new RegExp(`^${group.id}\\.(\\d+)\\.([^.]+)$`);
  const validFieldIds = new Set(group.fields.map((field) => field.id));
  const indices = Array.from(
    new Set(
      Object.keys(values)
        .map((key) => {
          const match = key.match(indexPattern);
          if (!match || !validFieldIds.has(match[2])) {
            return null;
          }

          return Number(match[1]);
        })
        .filter((value): value is number => value !== null)
    )
  ).sort((left, right) => left - right);

  const minimumItems = group.minItems ?? 1;
  if (indices.length === 0) {
    return Array.from({ length: minimumItems }, (_, index) => index);
  }

  while (indices.length < minimumItems) {
    const nextIndex = (indices.at(-1) ?? -1) + 1;
    indices.push(nextIndex);
  }

  return indices;
}

function applyGroupDefaults(
  template: GraphicTemplate,
  values: FieldValues,
  group: TemplateFieldGroup
): FieldValues {
  const nextValues = { ...values };

  for (const index of getGroupFieldIndices(group, nextValues)) {
    for (const field of group.fields) {
      const key = getGroupFieldKey(group.id, index, field.id);
      nextValues[key] = nextValues[key] ?? template.defaults[key] ?? field.defaultValue ?? '';
    }
  }

  return nextValues;
}

function getFlatTemplateFields(template: GraphicTemplate): TemplateField[] {
  return template.fields.flatMap((field) => (isTemplateFieldGroup(field) ? field.fields : field));
}

export function getTemplates(): GraphicTemplate[] {
  return GRAPHIC_TEMPLATES;
}

export function getTemplatesByCategory(category: TemplateCategory): GraphicTemplate[] {
  return GRAPHIC_TEMPLATES.filter((template) => template.category === category);
}

export function getTemplateById(id: string): GraphicTemplate {
  return GRAPHIC_TEMPLATES.find((template) => template.id === id) ?? GRAPHIC_TEMPLATES[0];
}

export function getDefaultTemplateForCategory(category: TemplateCategory): GraphicTemplate {
  return GRAPHIC_TEMPLATES.find((template) => template.category === category) ?? GRAPHIC_TEMPLATES[0];
}

export function getTemplateDefaults(template: GraphicTemplate): FieldValues {
  return template.fields.reduce<FieldValues>((accumulator, field) => {
    if (isTemplateFieldGroup(field)) {
      return applyGroupDefaults(template, accumulator, field);
    }

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

  for (const [key, value] of Object.entries(persistedValues)) {
    if (typeof value !== 'string') {
      continue;
    }

    if (getTemplateField(template, key)) {
      defaults[key] = value;
      continue;
    }

    for (const field of template.fields) {
      if (!isTemplateFieldGroup(field)) {
        continue;
      }

      const indexPattern = new RegExp(`^${field.id}\\.\\d+\\.([^.]+)$`);
      const match = key.match(indexPattern);
      if (match && field.fields.some((groupField) => groupField.id === match[1])) {
        defaults[key] = value;
      }
    }
  }

  return normalizeTemplateFieldValues(template, defaults);
}

export function ensureCompatiblePresetId(template: GraphicTemplate, presetId: string): string {
  if (template.supportedPresetIds.includes(presetId)) {
    return presetId;
  }

  const migratedPresetId = LEGACY_PRESET_ID_MIGRATIONS[presetId];
  if (migratedPresetId && template.supportedPresetIds.includes(migratedPresetId)) {
    return migratedPresetId;
  }

  return template.supportedPresetIds[0] ?? DEFAULT_PRESET_ID;
}

export function getTemplateField(template: GraphicTemplate, fieldId: string): TemplateField | undefined {
  const groupFieldMatch = fieldId.match(/^([^.]+)\.\d+\.([^.]+)$/);

  if (groupFieldMatch) {
    const [, groupId, nestedFieldId] = groupFieldMatch;
    const group = template.fields.find(
      (field): field is TemplateFieldGroup => isTemplateFieldGroup(field) && field.id === groupId
    );

    return group?.fields.find((field) => field.id === nestedFieldId);
  }

  return getFlatTemplateFields(template).find((field) => field.id === fieldId);
}

export function normalizeTemplateFieldValues(
  template: GraphicTemplate,
  values: FieldValues
): FieldValues {
  const normalizedValues = { ...values };

  for (const field of template.fields) {
    if (isTemplateFieldGroup(field)) {
      const indices = getGroupFieldIndices(field, normalizedValues);

      for (const index of indices) {
        for (const groupField of field.fields) {
          const groupKey = getGroupFieldKey(field.id, index, groupField.id);

          if (!(groupKey in normalizedValues)) {
            normalizedValues[groupKey] =
              template.defaults[groupKey] ?? groupField.defaultValue ?? '';
          }

          if (groupField.type !== 'select') {
            continue;
          }

          const options = getGroupFieldOptions(field, groupField, normalizedValues, index);
          if (options.length === 0) {
            normalizedValues[groupKey] = '';
            continue;
          }

          const selectedValue = normalizedValues[groupKey];
          if (options.some((option) => option.value === selectedValue)) {
            continue;
          }

          const defaultValue = template.defaults[groupKey] ?? groupField.defaultValue;
          normalizedValues[groupKey] =
            options.find((option) => option.value === defaultValue)?.value ?? options[0].value;
        }
      }

      continue;
    }

    if (field.type !== 'select') {
      continue;
    }

    const options = getFieldOptions(field, normalizedValues);
    if (options.length === 0) {
      normalizedValues[field.id] = '';
      continue;
    }

    const selectedValue = normalizedValues[field.id];
    if (options.some((option) => option.value === selectedValue)) {
      continue;
    }

    const defaultValue = template.defaults[field.id] ?? field.defaultValue;
    normalizedValues[field.id] =
      options.find((option) => option.value === defaultValue)?.value ?? options[0].value;
  }

  return normalizedValues;
}

export function getSupportedPresets(template: GraphicTemplate, presets: Preset[]): Preset[] {
  return presets.filter((preset) => template.supportedPresetIds.includes(preset.id));
}

export function isValidTemplateId(templateId: string): boolean {
  return GRAPHIC_TEMPLATES.some((template) => template.id === templateId);
}

export function isValidTemplateCategory(category: string): category is TemplateCategory {
  return category === 'business' || category === 'podcast';
}

export { DEFAULT_TEMPLATE_ID, getPresetById };
