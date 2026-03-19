export type PresetId =
  | "1200x627"
  | "1080x1080"
  | "1080x1350"
  | "1584x396"
  | "1128x191";

export type TemplateFieldType = "text" | "textarea" | "number" | "select" | "date";

export type FieldValues = Record<string, string>;

export interface TemplateFieldOption {
  label: string;
  value: string;
}

export interface TemplateField {
  id: string;
  label: string;
  type: TemplateFieldType;
  placeholder?: string;
  defaultValue?: string;
  multiline?: boolean;
  maxLength?: number;
  helpText?: string;
  options?: TemplateFieldOption[];
  dependsOn?: string;
  optionGroups?: Record<string, TemplateFieldOption[]>;
}

export interface GraphicTemplate {
  id: string;
  name: string;
  description: string;
  supportedPresetIds: PresetId[];
  htmlTemplate: string;
  css: string;
  fields: TemplateField[];
  defaults: Record<string, string>;
  resolveFieldValues?: (fieldValues: FieldValues) => FieldValues;
}
