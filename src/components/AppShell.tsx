import { useState, useCallback } from 'react';
import { useAppState } from '../hooks/useAppState';
import { getPresetById } from '../utils/presets';
import { exportPng } from '../utils/exportPng';
import { exportPdf } from '../utils/exportPdf';
import { TabNavigation } from './TabNavigation';
import { BottomActionBar } from './BottomActionBar';
import { PresetSelector } from './PresetSelector';
import { PreviewPanel } from './PreviewPanel';
import { HtmlEditor } from './HtmlEditor';
import { CssEditor } from './CssEditor';
import { TemplateManager } from './TemplateManager';
import { ErrorBanner } from './ErrorBanner';
import { ToastMessage } from './ToastMessage';
import styles from './AppShell.module.css';

function generateFilename(preset: { width: number; height: number }): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}${pad(now.getMinutes())}`;
  return `linkedin-${preset.width}x${preset.height}-${date}-${time}`;
}

export function AppShell() {
  const {
    state,
    toast,
    error,
    showError,
    dismissError,
    setHtmlContent,
    setCssContent,
    setSelectedPresetId,
    setActiveTab,
    setBackgroundMode,
    setZoomLevel,
    setPreviewScale,
    saveTemplate,
    loadTemplate,
    deleteTemplate,
    renameTemplate,
    duplicateTemplate,
  } = useAppState();

  const [showPresetSelector, setShowPresetSelector] = useState(false);

  const preset = getPresetById(state.selectedPresetId);

  const handleExportPng = useCallback(async () => {
    try {
      const filename = generateFilename(preset);
      await exportPng(state.htmlContent, state.cssContent, preset.width, preset.height, filename);
    } catch (err) {
      showError(
        `PNG-Export fehlgeschlagen: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`
      );
    }
  }, [state.htmlContent, state.cssContent, preset, showError]);

  const handleExportPdf = useCallback(() => {
    try {
      exportPdf(state.htmlContent, state.cssContent, preset.width, preset.height);
    } catch (err) {
      showError(
        `PDF-Export fehlgeschlagen: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`
      );
    }
  }, [state.htmlContent, state.cssContent, preset, showError]);

  const handleUpload = useCallback(
    (content: string) => {
      setHtmlContent(content);
      setActiveTab('preview');
    },
    [setHtmlContent, setActiveTab]
  );

  return (
    <div className={styles.app}>
      <ErrorBanner message={error} onDismiss={dismissError} />
      <TabNavigation activeTab={state.activeTab} onTabChange={setActiveTab} />

      <div className={styles.content}>
        {state.activeTab === 'preview' && (
          <PreviewPanel
            htmlContent={state.htmlContent}
            cssContent={state.cssContent}
            selectedPresetId={state.selectedPresetId}
            backgroundMode={state.backgroundMode}
            zoomLevel={state.zoomLevel}
            onBackgroundChange={setBackgroundMode}
            onZoomChange={setZoomLevel}
            onScaleChange={setPreviewScale}
          />
        )}

        {state.activeTab === 'html' && (
          <HtmlEditor
            htmlContent={state.htmlContent}
            onChange={setHtmlContent}
            onError={showError}
          />
        )}

        {state.activeTab === 'css' && (
          <CssEditor
            cssContent={state.cssContent}
            onChange={setCssContent}
            onSaveTemplate={saveTemplate}
          />
        )}

        {state.activeTab === 'templates' && (
          <TemplateManager
            templates={state.templates}
            activeTemplateId={state.activeTemplateId}
            onLoad={loadTemplate}
            onDelete={deleteTemplate}
            onRename={renameTemplate}
            onDuplicate={duplicateTemplate}
          />
        )}
      </div>

      <BottomActionBar
        onUpload={handleUpload}
        onExportPng={handleExportPng}
        onExportPdf={handleExportPdf}
        onPreset={() => setShowPresetSelector(true)}
        onError={showError}
      />

      {showPresetSelector && (
        <PresetSelector
          selectedPresetId={state.selectedPresetId}
          onSelect={setSelectedPresetId}
          onClose={() => setShowPresetSelector(false)}
        />
      )}

      <ToastMessage message={toast} />
    </div>
  );
}
