export interface Preset {
  id: string;
  label: string;
  width: number;
  height: number;
}

export interface TemplateOption {
  label: string;
  value: string;
}

export type TemplateFieldType = 'text' | 'textarea' | 'select' | 'number' | 'date' | 'image';
export type TemplateCategory = 'business' | 'podcast';

export type FieldValues = Record<string, string>;

export interface TemplateField {
  id: string;
  label: string;
  type: TemplateFieldType;
  placeholder?: string;
  defaultValue?: string;
  multiline?: boolean;
  maxLength?: number;
  helpText?: string;
  options?: TemplateOption[];
  dependsOn?: string;
  optionGroups?: Record<string, TemplateOption[]>;
}

export interface TemplateFieldGroup {
  id: string;
  label: string;
  type: 'group';
  fields: TemplateField[];
  itemLabel?: string;
  minItems?: number;
  maxItems?: number;
  addButtonLabel?: string;
  removeButtonLabel?: string;
}

export type TemplateFieldDefinition = TemplateField | TemplateFieldGroup;

export interface GraphicTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  supportedPresetIds: string[];
  htmlTemplate: string;
  css: string;
  fields: TemplateFieldDefinition[];
  defaults: Record<string, string>;
  rawHtmlPlaceholders?: string[];
  resolveFieldValues?: (fieldValues: FieldValues) => FieldValues;
}

export type TabId = 'content' | 'preview' | 'templates' | 'advanced';
export type BackgroundMode = 'white' | 'gray' | 'transparent';
export type ZoomLevel = 'fit' | '50' | '75' | '100';

export interface AppState {
  selectedCategory: TemplateCategory;
  selectedTemplateId: string;
  selectedPresetId: string;
  fieldValues: FieldValues;
  activeTab: TabId;
  previewScale: number;
  backgroundMode: BackgroundMode;
  zoomLevel: ZoomLevel;
}

export interface PersistedAppState {
  selectedCategory: TemplateCategory;
  selectedTemplateId: string;
  selectedPresetId: string;
  fieldValues: FieldValues;
  activeTab: TabId;
  previewScale: number;
  backgroundMode: BackgroundMode;
  zoomLevel: ZoomLevel;
}

export interface StorageLoadResult {
  state: PersistedAppState;
  error: string | null;
}
