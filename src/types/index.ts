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

export type TemplateFieldType = 'text' | 'textarea' | 'select' | 'number';

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
}

export interface GraphicTemplate {
  id: string;
  name: string;
  description: string;
  supportedPresetIds: string[];
  htmlTemplate: string;
  css: string;
  fields: TemplateField[];
  defaults: Record<string, string>;
}

export type TabId = 'content' | 'preview' | 'templates' | 'advanced';
export type BackgroundMode = 'white' | 'gray' | 'transparent';
export type ZoomLevel = 'fit' | '50' | '75' | '100';
export type FieldValues = Record<string, string>;

export interface AppState {
  selectedTemplateId: string;
  selectedPresetId: string;
  fieldValues: FieldValues;
  activeTab: TabId;
  previewScale: number;
  backgroundMode: BackgroundMode;
  zoomLevel: ZoomLevel;
}

export interface PersistedAppState {
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
