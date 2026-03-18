export interface Preset {
  id: string;
  label: string;
  width: number;
  height: number;
}

export interface CssTemplate {
  id: string;
  name: string;
  css: string;
  createdAt: number;
  updatedAt: number;
}

export type TabId = 'preview' | 'html' | 'css' | 'templates';
export type BackgroundMode = 'white' | 'gray' | 'transparent';
export type ZoomLevel = 'fit' | '50' | '75' | '100';

export interface AppState {
  htmlContent: string;
  cssContent: string;
  selectedPresetId: string;
  templates: CssTemplate[];
  activeTemplateId: string | null;
  previewScale: number;
  activeTab: TabId;
  backgroundMode: BackgroundMode;
  zoomLevel: ZoomLevel;
}

export interface PersistedAppState {
  htmlContent: string;
  cssContent: string;
  selectedPresetId: string;
  activeTemplateId: string | null;
  activeTab: TabId;
  backgroundMode: BackgroundMode;
  zoomLevel: ZoomLevel;
  templates: CssTemplate[];
}
