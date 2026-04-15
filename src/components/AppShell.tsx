import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppState } from '../hooks/useAppState';
import { exportPng, exportPngSlides, isIOSWebKit } from '../utils/exportPng';
import { exportPdf } from '../utils/exportPdf';
import { generateFilename } from '../utils/generateFilename';
import { copySlideHtml } from '../utils/generateSlideHtml';
import { applyPresetClassToHtml, buildPreviewDocument } from '../utils/previewDocument';
import { getPresetById } from '../utils/presets';
import { resolveTemplateSlides } from '../utils/resolveTemplateSlides';
import { getTemplateById, getTemplatesByCategory } from '../utils/templateRegistry';
import { CategorySelector } from './CategorySelector';
import { DynamicFieldForm } from './DynamicFieldForm';
import { ErrorBanner } from './ErrorBanner';
import { PresetSelector } from './PresetSelector';
import { PreviewPanel } from './PreviewPanel';
import { TabNavigation } from './TabNavigation';
import { TemplateLibrary } from './TemplateLibrary';
import { TemplateSelector } from './TemplateSelector';
import { ToastMessage } from './ToastMessage';
import styles from './AppShell.module.css';

const EXPORT_STATUS_DISPLAY_DURATION_MS = 4_000;
const CATEGORY_LABELS = {
  business: 'Business',
  podcast: 'Podcast',
} as const;

export function AppShell() {
  const previewFrameRef = useRef<HTMLIFrameElement>(null);
  const [copied, setCopied] = useState(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const {
    state,
    toast,
    error,
    showToast,
    showError,
    dismissError,
    setActiveTab,
    selectCategory,
    selectTemplate,
    selectPreset,
    updateFieldValue,
    addFieldGroupItem,
    removeFieldGroupItem,
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
  const categoryTemplates = useMemo(
    () => getTemplatesByCategory(state.selectedCategory),
    [state.selectedCategory]
  );
  const selectedPreset = useMemo(
    () => getPresetById(state.selectedPresetId),
    [state.selectedPresetId]
  );
  const isIOS = useMemo(() => isIOSWebKit(), []);
  const renderedSlides = useMemo(
    () => resolveTemplateSlides(selectedTemplate, state.fieldValues),
    [selectedTemplate, state.fieldValues]
  );
  const activeSlide = renderedSlides[Math.min(activeSlideIndex, renderedSlides.length - 1)] ?? renderedSlides[0];
  const renderedSlidesWithPresetClass = useMemo(
    () =>
      renderedSlides.map((slide) => ({
        ...slide,
        html: applyPresetClassToHtml(slide.html, selectedPreset.id),
      })),
    [renderedSlides, selectedPreset.id]
  );
  const activeSlideWithPresetClass =
    renderedSlidesWithPresetClass[Math.min(activeSlideIndex, renderedSlidesWithPresetClass.length - 1)] ??
    renderedSlidesWithPresetClass[0];
  const isMultiSlideTemplate = renderedSlides.length > 1;

  useEffect(() => {
    setActiveSlideIndex(0);
  }, [selectedTemplate.id]);

  useEffect(() => {
    setActiveSlideIndex((currentIndex) => Math.max(0, Math.min(currentIndex, renderedSlides.length - 1)));
  }, [renderedSlides.length]);

  const previewDocumentHtml = useMemo(
    () =>
      buildPreviewDocument(
        activeSlideWithPresetClass.html,
        activeSlideWithPresetClass.css,
        selectedPreset.width,
        selectedPreset.height
      ),
    [activeSlideWithPresetClass, selectedPreset.height, selectedPreset.width]
  );

  const handleExportPng = useCallback(async () => {
    setIsExporting(true);
    setExportStatus('PNG wird erstellt…');

    try {
      await exportPng(
        activeSlideWithPresetClass.html,
        activeSlideWithPresetClass.css,
        selectedPreset.width,
        selectedPreset.height,
        isMultiSlideTemplate
          ? activeSlideWithPresetClass.filename
          : generateFilename(selectedPreset, selectedTemplate),
        setExportStatus
      );
    } catch (exportError) {
      showError(
        `PNG-Export fehlgeschlagen: ${
          exportError instanceof Error ? exportError.message : 'Unbekannter Fehler'
        }`
      );
    } finally {
      setIsExporting(false);
      window.setTimeout(() => setExportStatus(null), EXPORT_STATUS_DISPLAY_DURATION_MS);
    }
  }, [activeSlideWithPresetClass, isMultiSlideTemplate, selectedPreset, selectedTemplate, showError]);

  const handleExportAllSlides = useCallback(async () => {
    setIsExporting(true);
    setExportStatus('Story-Slides werden erstellt…');

    try {
      await exportPngSlides(
        renderedSlidesWithPresetClass,
        selectedPreset.width,
        selectedPreset.height,
        setExportStatus
      );
    } catch (exportError) {
      showError(
        `Story-Export fehlgeschlagen: ${
          exportError instanceof Error ? exportError.message : 'Unbekannter Fehler'
        }`
      );
    } finally {
      setIsExporting(false);
      window.setTimeout(() => setExportStatus(null), EXPORT_STATUS_DISPLAY_DURATION_MS);
    }
  }, [renderedSlidesWithPresetClass, selectedPreset.height, selectedPreset.width, showError]);

  const handleCopyHtml = useCallback(async () => {
    try {
      await copySlideHtml(
        selectedTemplate,
        state.fieldValues,
        selectedPreset.width,
        selectedPreset.height,
        activeSlideIndex
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast('HTML in die Zwischenablage kopiert.');
    } catch {
      showError('HTML konnte nicht in die Zwischenablage kopiert werden.');
    }
  }, [activeSlideIndex, selectedTemplate, selectedPreset.width, selectedPreset.height, showToast, showError, state.fieldValues]);

  const handleExportPdf = useCallback(async () => {
    try {
      await exportPdf(
        previewDocumentHtml,
        selectedPreset.width,
        selectedPreset.height,
        previewFrameRef.current
      );
    } catch (exportError) {
      showError(
        `PDF-Export fehlgeschlagen: ${
          exportError instanceof Error ? exportError.message : 'Unbekannter Fehler'
        }`
      );
    }
  }, [previewDocumentHtml, selectedPreset.height, selectedPreset.width, showError]);

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
          <p className={styles.kicker}>Mobile-first Grafikgenerator für Business & Podcast</p>
          <h1 className={styles.title}>Social Graphic Builder</h1>
        </div>
        <div className={styles.headerMeta}>
          <span>{CATEGORY_LABELS[state.selectedCategory]}</span>
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
                  <h2 className={styles.sectionTitle}>Bereich wählen</h2>
                  <p className={styles.sectionText}>
                    Business- und Podcast-Vorlagen bleiben getrennt und verwenden dasselbe Formularsystem.
                  </p>
                </div>
              </div>
              <CategorySelector selectedCategory={state.selectedCategory} onSelect={selectCategory} />
            </section>

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
                templates={categoryTemplates}
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
                onAddGroup={addFieldGroupItem}
                onRemoveGroup={removeFieldGroupItem}
              />

              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={styles.previewCtaButton}
              >
                Vorschau ansehen →
              </button>
            </section>
          </div>
        )}

        {state.activeTab === 'preview' && (
          <div>
            <div className={styles.previewHeader}>
              <span className={styles.previewDimension}>
                {selectedPreset.width} × {selectedPreset.height} px
              </span>
              <div className={styles.previewHeaderActions}>
                <button
                  type="button"
                  onClick={() => { resetFieldValues(); setActiveTab('content'); }}
                  className={styles.previewResetButton}
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('content')}
                  className={styles.previewEditButton}
                >
                  ← Bearbeiten
                </button>
              </div>
            </div>

              <PreviewPanel
                documentHtml={previewDocumentHtml}
                preset={selectedPreset}
                backgroundMode={state.backgroundMode}
                zoomLevel={state.zoomLevel}
                onBackgroundChange={setBackgroundMode}
                onZoomChange={setZoomLevel}
                onScaleChange={setPreviewScale}
                frameRef={previewFrameRef}
                slideCount={renderedSlides.length}
                activeSlideIndex={activeSlideIndex}
                onPreviousSlide={() => setActiveSlideIndex((currentIndex) => Math.max(0, currentIndex - 1))}
                onNextSlide={() =>
                  setActiveSlideIndex((currentIndex) => Math.min(renderedSlides.length - 1, currentIndex + 1))
                }
              />

              <div className={styles.exportGrid}>
                {isMultiSlideTemplate && (
                  <button
                    type="button"
                    onClick={handleExportAllSlides}
                    disabled={isExporting}
                    className={styles.exportPrimaryButton}
                  >
                    {isExporting ? 'Wird erstellt…' : 'Alle Story-Slides exportieren'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleExportPng}
                  disabled={isExporting}
                  className={isMultiSlideTemplate ? styles.exportSecondaryButton : styles.exportPrimaryButton}
                >
                  {isExporting
                    ? 'Wird erstellt…'
                    : isMultiSlideTemplate
                      ? isIOS
                        ? 'Aktuelle Slide öffnen'
                        : 'Aktuelle Slide exportieren'
                      : isIOS
                        ? 'PNG öffnen'
                        : 'PNG exportieren'}
                </button>
                <button
                  type="button"
                onClick={handleExportPdf}
                className={styles.exportSecondaryButton}
              >
                PDF exportieren
              </button>
              <button
                type="button"
                onClick={handleCopyHtml}
                className={`${styles.exportSecondaryButton} ${copied ? styles.exportSecondaryButtonCopied : ''}`}
              >
                {copied ? '✓ Kopiert' : 'HTML kopieren'}
              </button>
            </div>
            {exportStatus && <p className={styles.exportStatus}>{exportStatus}</p>}
          </div>
        )}

        {state.activeTab === 'templates' && (
          <div className={styles.stack}>
            <section className={styles.card}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2 className={styles.sectionTitle}>Bereich wählen</h2>
                  <p className={styles.sectionText}>
                    Die Vorlagenbibliothek zeigt nur Templates des aktuell aktiven Bereichs.
                  </p>
                </div>
              </div>
              <CategorySelector selectedCategory={state.selectedCategory} onSelect={selectCategory} />
            </section>

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
                templates={categoryTemplates}
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
                {isMultiSlideTemplate && <span>Slide: {activeSlide.label}</span>}
              </div>

              <div className={styles.codeGrid}>
                <label className={styles.codeBlock}>
                  <span>Generiertes HTML</span>
                  <textarea readOnly value={activeSlide.html} className={styles.codeArea} />
                </label>
                <label className={styles.codeBlock}>
                  <span>Template CSS</span>
                  <textarea readOnly value={activeSlide.css} className={styles.codeArea} />
                </label>
              </div>
            </section>
          </div>
        )}
      </main>

      <ToastMessage message={toast} />
    </div>
  );
}
