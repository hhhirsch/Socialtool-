import { useCallback, useMemo, useRef } from 'react';
import { useAppState } from '../hooks/useAppState';
import { exportPdf } from '../utils/exportPdf';
import { exportPng } from '../utils/exportPng';
import { generateFilename } from '../utils/generateFilename';
import { copySlideHtml } from '../utils/generateSlideHtml';
import { buildPreviewDocument } from '../utils/previewDocument';
import { getPresetById } from '../utils/presets';
import { renderTemplate } from '../utils/renderTemplate';
import { getTemplateById, getTemplates } from '../utils/templateRegistry';
import { BottomActionBar } from './BottomActionBar';
import { DynamicFieldForm } from './DynamicFieldForm';
import { ErrorBanner } from './ErrorBanner';
import { PresetSelector } from './PresetSelector';
import { PreviewPanel } from './PreviewPanel';
import { TabNavigation } from './TabNavigation';
import { TemplateLibrary } from './TemplateLibrary';
import { TemplateSelector } from './TemplateSelector';
import { ToastMessage } from './ToastMessage';
import styles from './AppShell.module.css';

export function AppShell() {
  const templates = useMemo(() => getTemplates(), []);
  const previewFrameRef = useRef<HTMLIFrameElement>(null);
  const {
    state,
    toast,
    error,
    showToast,
    showError,
    dismissError,
    setActiveTab,
    selectTemplate,
    selectPreset,
    updateFieldValue,
    resetFieldValues,
    loadExampleContent,
    setBackgroundMode,
    setZoomLevel,
    setPreviewScale,
  } = useAppState();

  const selectedTemplate = useMemo(
    () => getTemplateById(state.selectedTemplateId),
    [state.selectedTemplateId]
  );
  const selectedPreset = useMemo(
    () => getPresetById(state.selectedPresetId),
    [state.selectedPresetId]
  );
  const resolvedFieldValues = useMemo(
    () => selectedTemplate.resolveFieldValues?.(state.fieldValues) ?? state.fieldValues,
    [selectedTemplate, state.fieldValues]
  );

  const renderedHtml = useMemo(
    () => renderTemplate(selectedTemplate.htmlTemplate, resolvedFieldValues, selectedTemplate.fields),
    [resolvedFieldValues, selectedTemplate.fields, selectedTemplate.htmlTemplate]
  );
  const previewDocumentHtml = useMemo(
    () => buildPreviewDocument(renderedHtml, selectedTemplate.css, selectedPreset.width, selectedPreset.height),
    [renderedHtml, selectedPreset.height, selectedPreset.width, selectedTemplate.css]
  );

  const handleExportPng = useCallback(async () => {
    try {
      await exportPng(
        previewDocumentHtml,
        selectedPreset.width,
        selectedPreset.height,
        generateFilename(selectedPreset, selectedTemplate),
        previewFrameRef.current
      );
    } catch (exportError) {
      showError(
        `PNG-Export fehlgeschlagen: ${
          exportError instanceof Error ? exportError.message : 'Unbekannter Fehler'
        }`
      );
    }
  }, [previewDocumentHtml, selectedPreset, selectedTemplate, showError]);

  const handleExportPdf = useCallback(async () => {
    try {
      await exportPdf(previewDocumentHtml, selectedPreset.width, selectedPreset.height);
    } catch (exportError) {
      showError(
        `PDF-Export fehlgeschlagen: ${
          exportError instanceof Error ? exportError.message : 'Unbekannter Fehler'
        }`
      );
    }
  }, [previewDocumentHtml, selectedPreset.height, selectedPreset.width, showError]);

  const handleCopyHtml = useCallback(async () => {
    try {
      await copySlideHtml(selectedTemplate, resolvedFieldValues, selectedPreset.width, selectedPreset.height);
      showToast('HTML in die Zwischenablage kopiert.');
    } catch {
      showError('HTML konnte nicht in die Zwischenablage kopiert werden.');
    }
  }, [selectedTemplate, resolvedFieldValues, selectedPreset.width, selectedPreset.height, showToast, showError]);

  const handleTabAction = useCallback(() => {
    setActiveTab(state.activeTab === 'preview' ? 'content' : 'preview');
  }, [setActiveTab, state.activeTab]);

  const handleLibrarySelect = useCallback(
    (templateId: string) => {
      selectTemplate(templateId);
      setActiveTab('content');
    },
    [selectTemplate, setActiveTab]
  );

  return (
    <div className={styles.app}>
      <ErrorBanner message={error} onDismiss={dismissError} />

      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Mobile-first LinkedIn Grafikgenerator</p>
          <h1 className={styles.title}>LinkedIn Graphic Builder</h1>
        </div>
        <div className={styles.headerMeta}>
          <span>{selectedTemplate.name}</span>
          <span>
            {selectedPreset.width} × {selectedPreset.height}px
          </span>
        </div>
      </header>

      <TabNavigation activeTab={state.activeTab} onTabChange={setActiveTab} />

      <main className={styles.content}>
        {state.activeTab === 'content' && (
          <div className={styles.stack}>
            <section className={styles.card}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2 className={styles.sectionTitle}>Vorlage wählen</h2>
                  <p className={styles.sectionText}>
                    Inhalte bleiben formularbasiert. HTML und CSS werden intern aus der Vorlage erzeugt.
                  </p>
                </div>
              </div>
              <TemplateSelector
                templates={templates}
                selectedTemplateId={selectedTemplate.id}
                onSelect={selectTemplate}
              />
            </section>

            <section className={styles.card}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2 className={styles.sectionTitle}>Format</h2>
                  <p className={styles.sectionText}>
                    Standard ist 1080 × 1350. Export und Vorschau verwenden immer die aktive Originalgröße.
                  </p>
                </div>
              </div>
              <PresetSelector
                selectedPresetId={selectedPreset.id}
                supportedPresetIds={selectedTemplate.supportedPresetIds}
                onSelect={selectPreset}
              />
            </section>

            <section className={styles.card}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2 className={styles.sectionTitle}>Inhalt</h2>
                  <p className={styles.sectionText}>{selectedTemplate.description}</p>
                </div>
                <div className={styles.inlineActions}>
                  <button type="button" className={styles.secondaryButton} onClick={loadExampleContent}>
                    Beispiel laden
                  </button>
                  <button type="button" className={styles.secondaryButton} onClick={resetFieldValues}>
                    Reset
                  </button>
                </div>
              </div>

              <DynamicFieldForm
                fields={selectedTemplate.fields}
                values={state.fieldValues}
                onChange={updateFieldValue}
              />
            </section>
          </div>
        )}

        {state.activeTab === 'preview' && (
          <PreviewPanel
            documentHtml={previewDocumentHtml}
            preset={selectedPreset}
            backgroundMode={state.backgroundMode}
            zoomLevel={state.zoomLevel}
            onBackgroundChange={setBackgroundMode}
            onZoomChange={setZoomLevel}
            onScaleChange={setPreviewScale}
            frameRef={previewFrameRef}
          />
        )}

        {state.activeTab === 'templates' && (
          <div className={styles.stack}>
            <section className={styles.card}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2 className={styles.sectionTitle}>Vorlagenbibliothek</h2>
                  <p className={styles.sectionText}>
                    Neue Templates können zentral über das datengetriebene Registry-System ergänzt werden.
                  </p>
                </div>
              </div>
              <TemplateLibrary
                templates={templates}
                selectedTemplateId={selectedTemplate.id}
                onSelect={handleLibrarySelect}
              />
            </section>
          </div>
        )}

        {state.activeTab === 'advanced' && (
          <div className={styles.stack}>
            <section className={styles.card}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2 className={styles.sectionTitle}>Readonly Expertenmodus</h2>
                  <p className={styles.sectionText}>
                    Debug-Ansicht des generierten Markups und der aktiven CSS-Vorlage. Die Standardnutzung bleibt formularbasiert.
                  </p>
                </div>
              </div>

              <div className={styles.debugMeta}>
                <span>Vorlage: {selectedTemplate.name}</span>
                <span>Preset: {selectedPreset.label}</span>
                <span>Skalierung: {Math.round(state.previewScale * 100)}%</span>
              </div>

              <div className={styles.codeGrid}>
                <label className={styles.codeBlock}>
                  <span>Generiertes HTML</span>
                  <textarea readOnly value={renderedHtml} className={styles.codeArea} />
                </label>
                <label className={styles.codeBlock}>
                  <span>Template CSS</span>
                  <textarea readOnly value={selectedTemplate.css} className={styles.codeArea} />
                </label>
              </div>
            </section>
          </div>
        )}
      </main>

      <BottomActionBar
        activeTab={state.activeTab}
        onTabAction={handleTabAction}
        onExportPng={handleExportPng}
        onExportPdf={handleExportPdf}
        onCopyHtml={handleCopyHtml}
        onReset={resetFieldValues}
      />

      <ToastMessage message={toast} />
    </div>
  );
}
